document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('new-assignment-form');
    const regularListContainer = document.getElementById('list-container');
    const urgentListContainer = document.getElementById('urgent-list-container');

    function isUrgent(dueDate) {
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
        const dueDateTime = new Date(dueDate).getTime();
        return (dueDateTime - now.getTime()) < oneDay;
    }

    function createListItem(name, dueDate) {
        const listItem = document.createElement('li');
        listItem.textContent = `${name} - Due: ${dueDate}`;
        const priorityLabel = createPriorityLabel(priority);
        const countdownTimer = createCountdownTimer(dueDate);
        listItem.prepend(priorityLabel);
        listItem.appendChild(countdownTimer);
        return listItem;
    }

    function addAssignment(name, dueDate) {
        const listItem = createListItem(name, dueDate, "High");
        const moveToCompletedBtn = document.createElement('button');
        moveToCompletedBtn.classList.add('move-to-completed-btn');
        moveToCompletedBtn.textContent = 'Complete';
        moveToCompletedBtn.onclick = function() {
            moveToCompleted(name, dueDate);
            listItem.remove();
        };

        listItem.appendChild(moveToCompletedBtn);
        if (isUrgent(dueDate)) {
            urgentListContainer.appendChild(listItem);
        } else {
            regularListContainer.appendChild(listItem);
        }
    }

    function moveToCompleted(name, dueDate) {
        const completedListContainer = document.getElementById('completed-list-container');
        const completedItem = createListItem(name, dueDate);
        completedListContainer.appendChild(completedItem);
    }
        // Function to create a priority label
    function createPriorityLabel(priority) {
        const label = document.createElement('span');
        label.classList.add('priority-label', `priority-${priority.toLowerCase()}`);
        label.textContent = priority;
        return label;
    }

    // Function to create a countdown timer
    function createCountdownTimer(dueDate) {
        const timer = document.createElement('span');
        timer.classList.add('countdown-timer');
        // Logic to calculate and display the countdown
        return timer;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const assignmentName = document.getElementById('assignment-name').value;
        const dueDate = document.getElementById('due-date').value;

        addAssignment(assignmentName, dueDate);
        form.reset(); // Reset form fields after adding the assignment
    });

    document.getElementById('contact-us').addEventListener('click', function() {
        window.location.href = 'mailto:HelpDesk@CourseCompass.com';
    });

    // Add search functionality
    document.getElementById('search-bar').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('#list-container li');
        tasks.forEach(task => {
            const text = task.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            task.style.display = isVisible ? 'block' : 'none';
        });
    });
});
