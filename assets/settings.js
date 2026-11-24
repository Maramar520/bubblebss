(function () {
  fetch('/data/settings.json')
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll('[data-settings]').forEach(el => {
        const key = el.getAttribute('data-settings');
        if (data[key] != null) el.textContent = data[key];
      });
      document.querySelectorAll('[data-settings-href]').forEach(el => {
        const key = el.getAttribute('data-settings-href');
        const val = data[key];
        if (!val || val.startsWith('[')) return;
        if (key === 'whatsapp_number') el.href = 'https://wa.me/' + val.replace(/\D/g, '');
        else if (key === 'email') el.href = 'mailto:' + val;
        else el.href = val;
      });
    })
    .catch(() => {});
})();
