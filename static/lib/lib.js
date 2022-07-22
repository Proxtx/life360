const animationTime = 500;

export const disappear = async () => {
  if (!window.disappear) return;
  for (let f of window.disappear) f();
  await new Promise((r) => setTimeout(r, animationTime));
};

export const link = async (linkTo, out = false) => {};
