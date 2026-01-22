import { useState, useEffect, RefObject } from "react";

interface Options {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export function useInView(
  ref: RefObject<Element | null>,
  options: Options = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options.root, options.rootMargin, options.threshold, options]);

  return isIntersecting;
}
