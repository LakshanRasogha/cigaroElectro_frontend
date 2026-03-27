"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  PhoneRegionOption,
  SORTED_PHONE_REGION_OPTIONS,
} from "@/app/lib/phone";

type PhoneRegionSelectProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
};

const PhoneRegionSelect = ({
  value,
  onChange,
  className = "",
  buttonClassName = "",
}: PhoneRegionSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const displayOption = useMemo(() => {
    return (
      SORTED_PHONE_REGION_OPTIONS.find((option) => option.code === value) || {
        code: value,
        label: value || "None",
        name: value || "None",
      }
    );
  }, [value]);

  useEffect(() => {
    setActiveCode(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (option: PhoneRegionOption) => {
    onChange(option.code);
    setActiveCode(option.code);
    setIsOpen(false);
  };

  const scrollToOption = (code: string) => {
    optionRefs.current[code]?.scrollIntoView({
      block: "nearest",
    });
  };

  const findMatch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return null;

    return (
      SORTED_PHONE_REGION_OPTIONS.find((option) =>
        option.name.toLowerCase().startsWith(normalizedQuery),
      ) ||
      SORTED_PHONE_REGION_OPTIONS.find((option) =>
        option.label.toLowerCase().startsWith(normalizedQuery),
      ) ||
      null
    );
  };

  const handleTypeahead = (key: string) => {
    searchBufferRef.current = `${searchBufferRef.current}${key.toLowerCase()}`;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchBufferRef.current = "";
    }, 500);

    const matchedOption = findMatch(searchBufferRef.current) || findMatch(key);
    if (!matchedOption) return;

    setIsOpen(true);
    setActiveCode(matchedOption.code);
    scrollToOption(matchedOption.code);
  };

  const moveActive = (direction: 1 | -1) => {
    const currentIndex = SORTED_PHONE_REGION_OPTIONS.findIndex(
      (option) => option.code === activeCode,
    );
    const fallbackIndex = SORTED_PHONE_REGION_OPTIONS.findIndex(
      (option) => option.code === value,
    );
    const startIndex = currentIndex >= 0 ? currentIndex : fallbackIndex;
    const nextIndex =
      startIndex >= 0
        ? Math.min(
            SORTED_PHONE_REGION_OPTIONS.length - 1,
            Math.max(0, startIndex + direction),
          )
        : 0;
    const nextOption = SORTED_PHONE_REGION_OPTIONS[nextIndex];
    if (!nextOption) return;

    setIsOpen(true);
    setActiveCode(nextOption.code);
    scrollToOption(nextOption.code);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      if (isOpen) {
        event.preventDefault();
        const matched =
          SORTED_PHONE_REGION_OPTIONS.find(
            (option) => option.code === activeCode,
          ) ||
          SORTED_PHONE_REGION_OPTIONS.find((option) => option.code === value);
        if (matched) {
          handleSelect(matched);
        }
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (/^[a-z0-9]$/i.test(event.key)) {
      event.preventDefault();
      handleTypeahead(event.key);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white/10 border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl px-2.5 sm:px-3 py-2.5 sm:py-3 md:py-4 text-white text-xs sm:text-sm font-bold focus:border-[#D4AF37]/50 transition-all flex items-center justify-between gap-2 ${buttonClassName}`}
      >
        <span className='truncate'>{displayOption.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute left-0 right-0 top-full mt-2 z-30 rounded-xl sm:rounded-2xl border border-white/10 bg-[#111111] shadow-2xl overflow-hidden'>
          <div className='max-h-48 overflow-y-auto'>
            {SORTED_PHONE_REGION_OPTIONS.map((option) => (
              <button
                key={option.code}
                type='button'
                onClick={() => handleSelect(option)}
                ref={(element) => {
                  optionRefs.current[option.code] = element;
                }}
                className={`w-full px-3 py-3 text-left text-xs sm:text-sm transition-colors ${
                  activeCode === option.code
                    ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span className='block font-bold'>{option.name}</span>
                <span className='block text-[11px] text-zinc-400'>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <div className='border-t border-white/10 bg-[#111111]'>
            <button
              type='button'
              onClick={() =>
                handleSelect({
                  code: "",
                  label: "None",
                  name: "None",
                })
              }
              className={`w-full px-3 py-3 text-left text-xs sm:text-sm transition-colors ${
                activeCode === ""
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "text-white hover:bg-white/5"
              }`}
            >
              <span className='block font-bold'>None</span>
              <span className='block text-[11px] text-zinc-400'>
                Leave as empty
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneRegionSelect;
