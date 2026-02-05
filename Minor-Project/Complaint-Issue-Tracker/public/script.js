// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = '';
    }, 5000);
}

// Get user's complaint IDs from localStorage
function getUserComplaintIds() {
    const ids = localStorage.getItem('userComplaintIds');
    return ids ? JSON.parse(ids) : [];
}

// Save complaint ID to localStorage
function saveComplaintId(id) {
    const ids = getUserComplaintIds();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem('userComplaintIds', JSON.stringify(ids));
    }
}

// Handle form submission
document.getElementById('complaintForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit complaint');
        }

        const complaint = await response.json();
        
        // Save complaint ID to localStorage
        saveComplaintId(complaint.id);

        // Show success message
        showAlert(`Complaint submitted successfully! Your complaint ID is: <strong>${complaint.id}</strong>`, 'success');

        // Reset form
        document.getElementById('complaintForm').reset();

        // Refresh user complaints
        loadUserComplaints();
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

// Load user's complaints
async function loadUserComplaints() {
    const userIds = getUserComplaintIds();
    const container = document.getElementById('userComplaints');

    if (userIds.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-title">No Complaints Yet</div>
                <div class="empty-state-description">Submit your first complaint using the form above.</div>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('/complaints');
        if (!response.ok) throw new Error('Failed to fetch complaints');
        
        const allComplaints = await response.json();
        const userComplaints = allComplaints.filter(c => userIds.includes(c.id));

        if (userComplaints.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-title">No Complaints Found</div>
                    <div class="empty-state-description">Your submitted complaints are not available.</div>
                </div>
            `;
            return;
        }

        const tableHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Complaint ID</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${userComplaints.map(complaint => `
                            <tr>
                                <td><strong>${complaint.id}</strong></td>
                                <td>${complaint.category}</td>
                                <td>
                                    <span class="badge badge-${complaint.status}">${complaint.status}</span>
                                </td>
                                <td>${new Date(complaint.createdAt).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = tableHTML;
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Error Loading Complaints</div>
                <div class="empty-state-description">${error.message}</div>
            </div>
        `;
    }
}

// Load user complaints on page load
loadUserComplaints();