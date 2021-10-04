const Time = () => {
  d = new Date();
  return `${String(d.getDate()).padStart(2, 0)}.${String(
    d.getMonth() + 1
  ).padStart(2, 0)}.${d.getFullYear()}  ${String(d.getHours()).padStart(
    2,
    0
  )}:${String(d.getMinutes()).padStart(2, 0)}:${String(d.getSeconds()).padStart(
    2,
    0
  )}`;
};

module.exports = Time;
