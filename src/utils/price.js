const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Igual que el formato de pesos argentino, pero sin el espacio entre el $ y
// el número ("$68.000" en vez de "$ 68.000").
export const priceFormatter = {
  format: (value) => currencyFormatter.format(value).replace(/\s/g, ""),
};
