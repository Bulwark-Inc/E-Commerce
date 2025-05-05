import { useMemo } from "react";

const usePagination = ({ totalItems, pageSize = 12, siblingCount = 1, currentPage }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return [...Array(totalPages).keys()].map((n) => n + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    const pages = [];

    if (!showLeftDots && showRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      pages.push(...leftRange, "...", totalPages);
    } else if (showLeftDots && !showRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      pages.push(firstPageIndex, "...", ...rightRange);
    } else if (showLeftDots && showRightDots) {
      let middleRange = Array.from({ length: 2 * siblingCount + 1 }, (_, i) => leftSiblingIndex + i);
      pages.push(firstPageIndex, "...", ...middleRange, "...", lastPageIndex);
    }

    return pages;
  }, [totalItems, pageSize, siblingCount, currentPage]);

  return { totalPages, paginationRange };
};

export default usePagination;
