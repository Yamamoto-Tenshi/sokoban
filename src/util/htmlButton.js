function createButton(text, classList) {
  const button = document.createElement("button");
  button.classList.add(...classList);
  button.textContent = text;
  return button;
}

export default createButton;