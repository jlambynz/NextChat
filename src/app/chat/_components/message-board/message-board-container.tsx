import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "~/lib/ui/button";

type Props = {
  children: ReactNode;
};

export function MessageBoardContainer({ children }: Props) {
  const [showScrollDown, setShowScrollDown] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const overflowContainerRef = useRef<HTMLDivElement>(null);

  function scrollToBottom(behavior: ScrollBehavior = "instant") {
    if (!overflowContainerRef.current) return;

    overflowContainerRef.current.scrollTo({
      top: overflowContainerRef.current.scrollHeight,
      behavior,
    });
    setAutoScroll(true);
  }

  useEffect(() => {
    if (!autoScroll) return;
    scrollToBottom();
  });

  useEffect(() => {
    if (!overflowContainerRef.current) return;

    const ref = overflowContainerRef.current;
    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = ref;
      const userScrolledUp = scrollHeight - scrollTop > clientHeight;
      setAutoScroll(!userScrolledUp);
      setShowScrollDown(userScrolledUp);
    }

    ref.addEventListener("scroll", handleScroll);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={overflowContainerRef}
      className="flex flex-1 flex-col overflow-auto"
    >
      {children}

      {showScrollDown && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-16 right-[50%] animate-bounce rounded-[50%]"
          onClick={() => scrollToBottom("smooth")}
        >
          <ChevronDown />
        </Button>
      )}
    </div>
  );
}
