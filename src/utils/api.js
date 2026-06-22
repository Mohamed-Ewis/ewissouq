export function unwrapApiData(response) {
  if (!response) return null
  if (response.success !== undefined && response.data !== undefined) {
    return response.data
  }
  if (response.data !== undefined && response.data !== null) {
    return response.data
  }
  return response
}
