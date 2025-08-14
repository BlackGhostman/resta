document.addEventListener('DOMContentLoaded', () => {
    const zoneButtons = document.querySelectorAll('.zone-btn');
    const currentZoneTitle = document.getElementById('current-zone-title');

    zoneButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            zoneButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to the clicked button
            button.classList.add('active');

            // Update the main header title
            const zoneName = button.textContent;
            currentZoneTitle.textContent = zoneName;

            // Here you would typically also load the tables for the selected zone
            // For example: loadTablesForZone(button.dataset.zone);
        });
    });
});
