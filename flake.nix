{
  description = "Life360 - A Node.js app for visualizing location data";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    let
      pname = "life360";
      version = "1.0.0";
      configPath = "/etc/${pname}/config.json";
    in
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_20;

        appPackage = pkgs.buildNpmPackage {
          inherit pname version;
          src = ./.;
          npmDepsHash = "sha256-CJlTm5iqnK3WBu0zVdA8jbdMrRGXbpyUBYZ1wMmdQm4=";
          nodejs = nodejs;

          dontNpmBuild = true;

          installPhase = ''
            mkdir -p $out
            cp -r * $out/
          '';
        };
      in
      {
        packages.default = appPackage;

        devShells.default = pkgs.mkShell {
          buildInputs = [ nodejs pkgs.nodePackages.npm ];
        };
      }
    ) // {
      nixosModules.default = { config, lib, pkgs, ... }:
        with lib;
        let
          appPackage = self.packages.${pkgs.system}.default;

          cfg = config.services.${pname};
          
          workDir = "/var/lib/${pname}";
        in {
          options.services.${pname} = {
            enable = mkEnableOption "Enable ${pname} service";

            config = mkOption {
              type = types.attrs;
              description = "Configuration written to ${configPath}";
              default = {};
            };

            publicKey = mkOption {
              type = types.nullOr types.path;
              description = "Public Key Path";
              default = null;
            };

            privateKey = mkOption {
              type = types.nullOr types.path;
              description = "Private Key Path";
              default = null;
            };
          };

          config = mkIf cfg.enable {
            environment.etc."${pname}/config.json".text =
              builtins.toJSON cfg.config;

            systemd.tmpfiles.rules = [
              "d ${workDir} 0755 root root -"
              "L+ ${workDir}/node_modules - - - - ${appPackage}/node_modules"
              "L+ ${workDir}/main.js - - - - ${appPackage}/main.js"
              "L+ ${workDir}/private - - - - ${appPackage}/private"
              "L+ ${workDir}/public - - - - ${appPackage}/public"
              "L+ ${workDir}/static - - - - ${appPackage}/static"
              "L+ ${workDir}/package.json - - - - ${appPackage}/package.json"
              "L+ ${workDir}/config.json - - - - ${configPath}"
            ];

            systemd.services.${pname} = {
              description = "${pname} node service";
              wantedBy = [ "multi-user.target" ];
              after = [ "network.target" ];

              serviceConfig = {
                ExecStart = "${pkgs.nodejs_20}/bin/node ${workDir}/main.js";
                Restart = "always";
                WorkingDirectory = workDir;
              };

              preStart = ''
                ${optionalString (cfg.publicKey != null) "cp ${cfg.publicKey} ${workDir}/public-key.pem"}
                ${optionalString (cfg.privateKey != null) "cp ${cfg.privateKey} ${workDir}/private-key.pem"}
              '';
            };
          };
        };
    };
}