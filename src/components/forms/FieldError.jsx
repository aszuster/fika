// Mensaje de error en rojo, debajo de un campo de formulario.
const FieldError = ({ id, message, className = "" }) =>
  message ? (
    <p id={id} role="alert" className={`by-sm text-[12px]! text-[#A20000] px-5 pb-2 ${className}`}>
      {message}
    </p>
  ) : null;

export default FieldError;
