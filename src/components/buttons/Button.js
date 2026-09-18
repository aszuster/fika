"use client";

const Button = ({
  copy,
  className = "",
  url,
  target = "_self",
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  const isDisabled = disabled;

  const variantStyles = {
    primary:
      "cursor-pointer w-full flex items-center justify-center relative bg-primary-00 text-primary-01 btn-sm py-4 transition-all duration-300 ease-in-out hover:bg-secondary-00 hover:text-primary-01",
    secondary: "cursor-pointer relative inline-flex items-center bg-transparent text-primary-00 btn-sm p-1 border border-transparent rounded-[3px] transition-all duration-300 ease-in-out hover:text-secondary-01 active:border-primary-00 focus:border-primary-00",
    tertiary: "cursor-pointer relative inline-flex items-center bg-transparent text-primary-00 btn-sm border-b border-primary-00 transition-all duration-300 leading-[20px]! ease-in-out hover:text-secondary-01 hover:border-b-primary-01 active:border-b-primary-00 focus:border-b-primary-00",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  const Element = url ? "a" : "button";

  const elementProps = url
    ? {
        href: url,
        target,
        rel: target === "_blank" ? "noopener noreferrer" : undefined,
        ...(url.startsWith("#") && !isDisabled
          ? { onClick: handleScroll }
          : {}),
      }
    : {
        type: type === "submit" ? "submit" : "button",
        disabled: isDisabled,
        onClick,
      };

  return (
    <Element  className={[
          selectedVariant,
          isDisabled
            ? "bg-primary-03! text-primary-01! border! border-primary-00"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}       
    {...elementProps}>
      <span
       
      >
        {/* {variant === 'black' && (
          <span
            className={`rounded-full transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden ${
              isDisabled
                ? 'w-[8px] h-[8px] bg-grey-00'
                : 'w-[8px] h-[8px] bg-grey-00 group-hover:w-[26px] group-hover:h-[26px] group-hover:p-1 group-hover:bg-orange'
            }`}
          >
            <span className={`relative inline-block overflow-hidden transition-all duration-300 ease-in-out ${
              isDisabled 
                ? 'w-0 h-0' 
                : 'w-0 h-0 group-hover:w-[18px] group-hover:h-[15px]'
            }`}>
              <ArrowLeft
                color={isDisabled ? '#000000' : '#000000'}
                className={`absolute -translate-x-[200%] opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-75 ${
                  isDisabled ? '' : ''
                }`}
                width="18"
                height="15"
              />
            </span>
          </span>
        )} */}
        {/* {variant === 'white' && (
          <span
            className={`rounded-full transition-all duration-300 ease-in-out flex items-center justify-center overflow-hidden ${
              isDisabled
                ? 'w-[8px] h-[8px] bg-grey-30'
                : `w-[8px] h-[8px] ${dotColor || 'bg-grey-40'} group-hover:w-[26px] group-hover:h-[26px] group-hover:p-1 group-hover:bg-grey-40`
            }`}
          >
            <span className={`relative inline-block overflow-hidden transition-all duration-300 ease-in-out ${
              isDisabled
                ? 'w-0 h-0'
                : 'w-0 h-0 group-hover:w-[18px] group-hover:h-[15px]'
            }`}>
              <ArrowLeft
                color={isDisabled ? '#666666' : '#ffffff'}
                className={`absolute -translate-x-[200%] opacity-0 scale-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-75 ${
                  isDisabled ? '' : ''
                }`}
                width="18"
                height="15"
              />
            </span>
          </span>
        )} */}
        {/* {variant !== 'glassArrow' && (shimmer ? <span className="text-shimmer">{copy}</span> : copy)} */}
        {/* {loading && (
          <span className="ml-3 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )} */}
        {/* {(variant === 'glass' || variant === 'glassArrow') && !loading && (
          <ArrowLeftLight
            color="currentColor"
            className="duration-300"
          />
        )} */}
        {copy}
      </span>
    </Element>
  );
};

export default Button;
