{
  description = "Life360 - A Node.js app for visualizing location data";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: 
    flake-utils.lib.eachDefaultSystem (system: 
      let
        pkgs = nixpkgs.legacyPackages.${system};

        nodejs = pkgs.nodejs_20;  # Use Node.js 20 or another version

        # Install dependencies separately
        nodeModules = pkgs.runCommand "node_modules" {} ''
          set -o xtrace
          export HOME=/tmp/
          export NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
          cp ${./package.json} package.json
          cp ${./package-lock.json} package-lock.json
          ${nodejs}/bin/npm ci --omit=dev --loglevel verbose
          mv node_modules $out
        '';

        # Package the whole project, ensuring all files are included
        app = pkgs.stdenv.mkDerivation {
          name = "life360";
          src = ./.;  # Include all files at the top level

          buildInputs = [ nodejs pkgs.cacert ];

          buildPhase = ''
            runHook preBuild
            cp -r ${nodeModules} ./node_modules
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r ./* $out/  # Copy everything (JS files, static assets, etc.)
            runHook postInstall
          '';

          meta = {
            description = "Life360 - A Node.js app for visualizing location data";
            platforms = pkgs.lib.platforms.unix;
          };
        };
        in {
          packages = {
            inherit app;
            inherit nodejs;
          };
        }
    ) // {
        nixosModules.default = { config, lib, pkgs, ... }: {
          options.services.life360 = {
            enable = lib.mkEnableOption "Enable the Life360 service";
            user = lib.mkOption {
              type = lib.types.str;
              default = "life360";
              description = "User to run the Life360 service";
            };
            group = lib.mkOption {
              type = lib.types.str;
              default = "life360";
              description = "Group to run the Life360 service";
            };
            package = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.system}.app;
              description = "Package for the Life360 application";
            };
            nodejs = lib.mkOption {
              type = lib.types.package;
              default = self.packages.${pkgs.system}.nodejs;
              description = "NodeJS to run this package";
            };
            config = lib.mkOption {
              type = lib.types.attrs;
              default = {};
              description = "Configuration for Life360";
            };
          };

          config = lib.mkIf config.services.life360.enable {
            users.groups."${config.services.life360.group}" = {};
            users.users."${config.services.life360.user}" = {
              group = config.services.life360.group;
              isSystemUser = true;
            };

            systemd.services.life360 = {
              description = "Life360 - Location Visualization Service";
              after = [ "network.target" ];
              wantedBy = [ "multi-user.target" ];
              serviceConfig = {
                ExecStart = "${pkgs.nodejs_20}/bin/node ${config.services.life360.package}/main.js";
                Restart = "always";
                User = config.services.life360.user;
                Group = config.services.life360.group;
                WorkingDirectory = "/var/lib/life360";
              };
            };

            system.activationScripts.setupLife360 = ''
              mkdir -p /var/lib/life360
              cp -r ${config.services.life360.package}/* /var/lib/life360/
              cp ${(pkgs.formats.json {}).generate "" config.services.life360.config} /var/lib/life360/config.json
              chown -R ${config.services.life360.user}:${config.services.life360.group} /var/lib/life360
            '';
          };
        };
    };
}