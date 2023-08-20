export function isChecked(id: string) {
  return (document.getElementById(id) as HTMLInputElement).checked;
}

export function getRadioGroupValue(name: string) {
  return (document.querySelector(`input[name='${name}']:checked`) as HTMLInputElement).value;
}
