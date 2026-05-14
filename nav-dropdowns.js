(function () {
  const dropdownSelector = 'details.menu-switch, details.lang-switch, details.property-dropdown';
  const dropdowns = Array.from(document.querySelectorAll(dropdownSelector));

  if (!dropdowns.length) return;

  const closeDropdown = (dropdown) => {
    dropdown.open = false;
  };

  const closeOthers = (activeDropdown) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== activeDropdown) closeDropdown(dropdown);
    });
  };

  dropdowns.forEach((dropdown) => {
    let closeTimer;

    const cancelClose = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = undefined;
      }
    };

    dropdown.addEventListener('toggle', () => {
      if (dropdown.open) closeOthers(dropdown);
    });

    dropdown.addEventListener('mouseenter', cancelClose);
    dropdown.addEventListener('focusin', cancelClose);

    dropdown.addEventListener('mouseleave', () => {
      if (dropdown.open) {
        cancelClose();
        closeTimer = window.setTimeout(() => closeDropdown(dropdown), 650);
      }
    });

    dropdown.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeDropdown(dropdown));
    });
  });

  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest(dropdownSelector)) {
      dropdowns.forEach(closeDropdown);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dropdowns.forEach(closeDropdown);
    }
  });
})();
