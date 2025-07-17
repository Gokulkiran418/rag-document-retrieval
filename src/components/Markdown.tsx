import React, { ComponentPropsWithoutRef } from "react";

export const markdownComponents = {
  code({
    inline,
    className = "",
    children,
    ...props
  }: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) {
    return (
      <code
        className={`${
          inline
            ? "bg-gray-200 dark:bg-zinc-800 px-1 py-0.5 rounded"
            : "block bg-gray-100 dark:bg-zinc-900 p-4 rounded-md my-2 overflow-auto"
        } text-sm font-mono ${className}`}
        {...props}
      >
        {children}
      </code>
    );
  },

  a({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
    return (
      <a
        href={href}
        className="text-blue-600 underline dark:text-blue-400"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },

  ul({ children, ...props }: ComponentPropsWithoutRef<"ul">) {
    return (
      <ul className="list-disc ml-5 mb-2" {...props}>
        {children}
      </ul>
    );
  },

  ol({ children, ...props }: ComponentPropsWithoutRef<"ol">) {
    return (
      <ol className="list-decimal ml-5 mb-2" {...props}>
        {children}
      </ol>
    );
  },

  li({ children, ...props }: ComponentPropsWithoutRef<"li">) {
    return (
      <li className="mb-1 leading-relaxed" {...props}>
        {children}
      </li>
    );
  },

  blockquote({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) {
    return (
      <blockquote
        className="border-l-4 border-gray-400 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-300"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
};
