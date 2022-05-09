export function get_now() {
  return new Date(Date.now())
}

export function get_now_string() {
  return get_now().toISOString();
}

export function get_now_filename() {
  return get_now_string().substring(0, 19).replace(/[T:]/g, "-");
}
