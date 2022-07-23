const animationTime = 200;

export const disappear = async (ignoreStats = false) => {
  if (window.stats && !ignoreStats) {
    stats.style.transform = "translate(-50%, 100%)";
  }
  let p;
  if (window.headComponent) {
    p = window.headComponent.disappear();
  }
  if (window.disappear)
    for (let f of window.disappear) {
      f();
      await new Promise((r) => setTimeout(r, animationTime));
    }

  await p;
};

export const link = async (link, ignoreStats = false) => {
  await disappear(ignoreStats);
  return (location.href = link);
};

window.link = link;
