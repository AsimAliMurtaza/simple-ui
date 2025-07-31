"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react"; // Assuming you have lucide-react or similar icon library

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: "default" | "underline" | "bordered" | "glass" | "ghost";
  labelAnimate?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  adornmentClickable?: boolean;
}

const variantMap = {
  default:
    "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md",
  underline:
    "bg-transparent border-b border-gray-400 focus:border-black dark:focus:border-white",
  bordered:
    "bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg",
  glass: "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl",
  ghost: "bg-transparent border-none",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      className,
      variant = "default",
      labelAnimate = false,
      leftAdornment,
      rightAdornment,
      adornmentClickable = false,
      onFocus,
      onBlur,
      type, // Destructure type here to handle password visibility
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [value, setValue] = React.useState(
      props.value || props.defaultValue || ""
    );
    const [showPassword, setShowPassword] = React.useState(false); // New state for password visibility

    React.useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value);
      }
    }, [props.value]);

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        props.onChange?.(e);
      },
      [props.onChange]
    );

    const togglePasswordVisibility = React.useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const isFloating = labelAnimate && (focused || value);

    const inputType = type === "password" && showPassword ? "text" : type;

    const currentRightAdornment =
      type === "password" ? (
        <button
          type="button" // Important: type="button" to prevent form submission
          onClick={togglePasswordVisibility}
          onMouseDown={(e) => e.preventDefault()} // Prevents input losing focus
          className="focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      ) : (
        rightAdornment
      );

    const paddingLeftClass = leftAdornment ? "pl-2 md:pl-3 lg:pl-4" : "pl-4";
    const paddingRightClass = currentRightAdornment
      ? "pr-2 md:pr-3 lg:pr-4"
      : "pr-4";
    const basePaddingClass = "py-2";

    return (
      <div className="w-full flex flex-col gap-1 relative">
        {label && (
          <motion.label
            htmlFor={props.id || props.name}
            className={cn(
              "absolute text-sm font-medium text-gray-700 dark:text-gray-200 pointer-events-none",
              !labelAnimate && "static mb-1",
              labelAnimate && "left-4 transition-all duration-200 ease-out",
              labelAnimate && !isFloating && "top-1/2 -translate-y-1/2",
              labelAnimate && isFloating && "-top-6 -mx-3 text-sm"
            )}
            animate={
              labelAnimate
                ? {
                    y: isFloating ? 0 : 0,
                    x: 0,
                    scale: isFloating ? 0.85 : 1,
                    color: focused
                      ? "var(--tw-text-blue-600)"
                      : errorText
                      ? "var(--tw-text-red-500)"
                      : "var(--tw-text-gray-700)",
                    originX: 0,
                  }
                : {}
            }
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <div
          className={cn(
            "flex items-center w-full transition-all duration-200",
            variantMap[variant],
            (leftAdornment || currentRightAdornment) && "relative",
            {
              "focus-within:border-blue-500 dark:focus-within:border-blue-400":
                variant !== "ghost" && !errorText,
              "focus-within:border-red-500 dark:focus-within:border-red-400":
                !!errorText,
              "ring-2 ring-blue-500/20 dark:ring-blue-400/20":
                focused && variant === "glass" && !errorText,
              "ring-2 ring-red-500/20 dark:ring-red-400/20":
                focused && variant === "glass" && !!errorText,
            },
            className
          )}
        >
          {leftAdornment && (
            <div
              className={cn(
                "flex items-center justify-center h-full text-gray-500 dark:text-gray-400 pl-3 pr-2",
                adornmentClickable && "cursor-pointer"
              )}
            >
              {leftAdornment}
            </div>
          )}

          <motion.input
            ref={ref}
            type={inputType} // Dynamically set type
            className={cn(
              "flex-grow outline-none text-sm transition-all duration-200 bg-transparent",
              "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
              (variant === "default" ||
                variant === "bordered" ||
                variant === "glass") &&
                `${paddingLeftClass} ${paddingRightClass} ${basePaddingClass}`,
              variant === "underline" && "px-2 py-1",
              variant === "ghost" && "px-2 py-1",
              !labelAnimate &&
                (leftAdornment || currentRightAdornment) &&
                "py-2"
            )}
            initial={{ scale: 1 }}
            whileFocus={{ scale: 1.01 }}
            whileHover={{ scale: 1.005 }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            id={props.id}
            name={props.name}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            disabled={props.disabled}
            readOnly={props.readOnly}
            required={props.required}
            min={props.min}
            max={props.max}
            minLength={props.minLength}
            maxLength={props.maxLength}
            step={props.step}
            pattern={props.pattern}
            inputMode={props.inputMode}
            tabIndex={props.tabIndex}
            // Add more props as needed, but avoid spreading all props
          />

          {currentRightAdornment && (
            <div
              className={cn(
                "flex items-center justify-center h-full text-gray-500 dark:text-gray-400 pr-3 pl-2",
                type !== "password" && adornmentClickable && "cursor-pointer"
              )}
            >
              {currentRightAdornment}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {helperText && !errorText && (
            <motion.p
              key="helper"
              className="text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}

          {errorText && (
            <motion.p
              key="error"
              className="text-xs text-red-500 dark:text-red-400"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {errorText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
