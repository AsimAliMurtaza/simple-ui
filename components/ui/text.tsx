"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  HTMLMotionProps,
  Variants as FramerVariants,
} from "framer-motion";

export type MotionAnimationVariant =
  | "default"
  | "fade"
  | "slide"
  | "scale"
  | "bounce"
  | "cascadeUp"
  | "rotate"
  | "pop";

export interface TextProps extends HTMLMotionProps<"p"> {
  animation?: MotionAnimationVariant;
  as?: React.ElementType;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  color?: string;
  children?: React.ReactNode;
  staggerMs?: number;
}

const textMotionVariants: Record<
  MotionAnimationVariant,
  FramerVariants | undefined
> = {
  default: {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { duration: 0 } },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    whileHover: { opacity: 0.7 },
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
    whileHover: { x: 5 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 12 },
    },
    whileHover: { scale: 1.05 },
  },
  bounce: {
    initial: { y: -50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
    whileHover: { y: -5 },
  },
  rotate: {
    initial: { rotate: -10, opacity: 0 },
    animate: { rotate: 0, opacity: 1, transition: { duration: 0.5 } },
    whileHover: { rotate: 5, scale: 1.05 },
  },
  pop: {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
    whileHover: { scale: 1.1 },
  },
  cascadeUp: undefined,
};

const cascadeCharVariants: FramerVariants = {
  initial: { y: "100%", opacity: 0 },
  animate: {
    y: "0%",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
  hover: {
    y: "-10%",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
};

const sizeMap: Record<NonNullable<TextProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      animation = "default",
      size = "base",
      as: Component = "p",
      color,
      children,
      staggerMs = 40,
      style,
      initial,
      animate,
      whileHover,
      whileTap,
      transition,
      ...props
    },
    ref
  ) => {
    const MotionComponent = motion(Component);

    const baseClasses = cn(
      "text-gray-800 dark:text-gray-200",
      sizeMap[size],
      className
    );

    const combinedStyle = {
      ...(style || {}),
      ...(color ? { color } : {}),
    };

    if (animation === "cascadeUp" && typeof children === "string") {
      const chars = Array.from(children);

      return (
        <MotionComponent
          ref={ref}
          className={cn(
            baseClasses,
            "overflow-hidden inline-flex flex-wrap group"
          )}
          style={combinedStyle}
          initial="initial"
          animate="animate"
          whileHover="hover"
          transition={{ staggerChildren: staggerMs / 1000 }}
          {...props}
        >
          {chars.map((ch, i) => {
            const displayChar = ch === " " ? "\u00A0" : ch;
            return (
              <motion.span
                key={`${ch}-${i}`}
                variants={cascadeCharVariants}
                aria-hidden={ch === " " ? undefined : "true"}
              >
                {displayChar}
              </motion.span>
            );
          })}
          <span className="sr-only">{children}</span>
        </MotionComponent>
      );
    }

    const motionProps = {
      initial:
        initial || (textMotionVariants[animation] as FramerVariants)?.initial,
      animate:
        animate || (textMotionVariants[animation] as FramerVariants)?.animate,
      whileHover:
        whileHover ||
        (textMotionVariants[animation] as FramerVariants)?.whileHover,
      whileTap:
        whileTap || (textMotionVariants[animation] as FramerVariants)?.whileTap,
      transition:
        transition ||
        (textMotionVariants[animation] as FramerVariants)?.transition,
    };

    return (
      <MotionComponent
        ref={ref}
        className={baseClasses}
        style={combinedStyle}
        {...motionProps}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Text.displayName = "Text";

export default Text;
