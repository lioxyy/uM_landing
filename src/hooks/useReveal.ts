import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function useRevealCards(n: number) {
  const refs = useRef<(HTMLDivElement | null)[]>(Array(n).fill(null));
  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), i * 110);
            obs.disconnect();
          }
        },
        { threshold: 0.08 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    });
  }, [n]);
  return refs;
}
