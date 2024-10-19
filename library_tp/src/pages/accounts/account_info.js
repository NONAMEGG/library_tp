export const GetInfo = () => {
  if (!info) info = JSON.parse(localStorage.getItem("account"));
  return info;
};
var info;
export const UpsertInfo = (key, value) => {
  if (key == info.id) return;
  info[key] = value;
  InfoUpdated();
};
const InfoUpdated = () => {
  localStorage.setItem("account", JSON.stringify(info));
};
