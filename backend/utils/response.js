exports.ok = (res, data, meta, status = 200) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

exports.paginate = (items, page = 1, pageSize = 12) => {
  const p = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 12);
  const start = (p - 1) * size;
  const data = items.slice(start, start + size);
  return {
    data,
    meta: {
      page: p,
      pageSize: size,
      total: items.length,
      hasMore: start + size < items.length,
    },
  };
};
