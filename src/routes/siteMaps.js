export const dashboardRoutes = {
  label: "Genel",
  labelDisable: true,
  children: [
    {
      name: "Genel",
      active: true,
      icon: "chart-pie",
      children: [
        {
          name: "Ana Konfigürasyon Parametreleri",
          to: "/",
          exact: true,
          active: true,
        },
        {
          name: "Parametre Grupları",
          to: "/parameter-groups",
          exact: true,
          active: true,
        },
        {
          name: "Parametre Tanımları",
          to: "/parameter-definitions",
          active: true,
        },
      ],
    },
  ],
};

export const gameParameters = {
  label: "Oyun Parametreleri",
  children: [
    {
      name: "Building Configurations",
      icon: "wrench",
      to: "/building-configurations",
      active: true,
    },
  ],
};

export default [dashboardRoutes, gameParameters];
