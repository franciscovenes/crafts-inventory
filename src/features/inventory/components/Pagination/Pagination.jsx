import { Link, useSearchParams } from "react-router-dom";
import styles from "./Pagination.module.css";
import { getPager, createPageLink } from "./paginationUtils";
import { Fragment } from "react";

export default function Pagination({ total, pageSize }) {
  const [searchParams] = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const currentPage = Number(searchParams.get("page")) || 1;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const pager = getPager(currentPage, totalPages);

  return (
    <div className={styles.container} aria-label="Pagination">
      <div className={styles.summary}>
        Showing {startItem}-{endItem} of {total} items
      </div>
      <nav className={styles.pagination}>
        <div className={styles.previous}>
          {currentPage > 1 ? (
            <Link to={createPageLink(currentPage - 1, searchParams)}>
              ← Previous
            </Link>
          ) : null}
        </div>

        <div className={styles.mobilePager}>
          Page {currentPage} of {totalPages}
        </div>
        <div className={styles.desktopPager}>
          {pager.map((page, index) => {
            const previousPage = pager[index - 1];

            return (
              <Fragment key={page}>
                {previousPage && page - previousPage > 1 && (
                  <span className={styles.ellipsis}>…</span>
                )}
                {page === currentPage ? (
                  <span className={styles.currentPage} aria-current="page">
                    {page}
                  </span>
                ) : (
                  <Link to={createPageLink(page, searchParams)}>{page}</Link>
                )}
              </Fragment>
            );
          })}
        </div>
        <div className={styles.next}>
          {currentPage < totalPages ? (
            <Link to={createPageLink(currentPage + 1, searchParams)}>
              Next →
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}
