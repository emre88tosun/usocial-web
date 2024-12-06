import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export default function useSkin() {
  const [skin, setSkin] = useLocalStorage('skin', 'light');

  useEffect(() => {
    const element = window.document.body;
    element.classList.remove(...element.classList);
    if (skin !== 'light') {
      element.classList.add('dark');
    }
  }, [skin]);

  return {
    skin,
    setSkin,
  };
}
