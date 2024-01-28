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

    function createPriorityLabel(priority) {
        const label = document.createElement('span');
        label.classList.add('priority-label', `priority-${priority.toLowerCase()}`);
        label.textContent = priority;
        return label;
    }

    function createCountdownTimer(dueDate) {
        const timer = document.createElement('span');
        timer.classList.add('countdown-timer');
        const dueTime = new Date(dueDate).getTime();
        const updateTime = () => {
            const currentTime = new Date().getTime();
            const timeLeft = dueTime - currentTime;
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            timer.textContent = `${days} days left`;
            if (timeLeft < 0) {
                timer.textContent = "Expired";
                clearInterval(interval);
            }
        };
        const interval = setInterval(updateTime, 1000);
        updateTime();
        return timer;
    }
    
    function createListItem(name, dueDate, priority = 'High') {
        const listItem = document.createElement('li');
        listItem.textContent = `${name} - Due: ${dueDate}`;
        const priorityLabel = createPriorityLabel(priority);
        const countdownTimer = createCountdownTimer(dueDate);
        listItem.prepend(priorityLabel);
        listItem.appendChild(countdownTimer);
        listItem.setAttribute('data-due-date', dueDate);
        return listItem;
    }

    // get priority
    function getPriority(dueDate) {
        const now = new Date();
        const dueTime = new Date(dueDate).getTime();
        const timeDiff = dueTime - now.getTime();
        const daysLeft = timeDiff / (1000 * 60 * 60 * 24);
    
        if (daysLeft <= 2) return 'High';
        if (daysLeft <= 7) return 'Medium';
        return 'Low';
    }

    function addAssignment(name, dueDate) {
        const priority = getPriority(dueDate);
        const listItem = createListItem(name, dueDate, priority);
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

    document.getElementById('search-bar').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const tasks = document.querySelectorAll('#list-container li');
        tasks.forEach(task => {
            const text = task.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            task.style.display = isVisible ? 'block' : 'none';
        });
    });

    // generates schedule
    document.getElementById('generate-schedule-btn').addEventListener('click', function() {
        generateWeeklySchedule();
    });
    
    function generateWeeklySchedule() {
        const now = new Date();
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
        const scheduleContainer = document.getElementById('weekly-schedule');
        scheduleContainer.innerHTML = ''; // Clear existing schedule
    
        const assignments = document.querySelectorAll('#list-container li, #urgent-list-container li');
        const weeklyAssignments = Array.from(assignments).filter(assignment => {
            const dueDate = new Date(assignment.getAttribute('data-due-date'));
            return dueDate >= now && dueDate <= endOfWeek;
        });
    
        if (weeklyAssignments.length === 0) {
            scheduleContainer.textContent = 'No assignments due this week.';
            return;
        }
        // //////
        const scheduleList = document.createElement('ul');
        scheduleList.classList.add('schedule-list');

        weeklyAssignments.forEach(assignment => {
            const listItem = document.createElement('li');
            listItem.classList.add('schedule-item');

            const dueDateText = document.createElement('span');
            dueDateText.classList.add('due-date');
            dueDateText.textContent = assignment.getAttribute('data-due-date');

            const daysLeftText = document.createElement('span');
            daysLeftText.classList.add('days-left');
            const dueDate = new Date(assignment.getAttribute('data-due-date'));
            const daysLeft = Math.floor((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            daysLeftText.textContent = `${daysLeft} days left`;

            const assignmentName = document.createElement('span');
            assignmentName.classList.add('assignment-name');
            assignmentName.textContent = assignment.textContent;

            listItem.appendChild(dueDateText);
            listItem.appendChild(assignmentName);
            listItem.appendChild(daysLeftText);

            scheduleList.appendChild(listItem);
        });

        scheduleContainer.appendChild(scheduleList);
    }
    fetch('assignments.json')
        .then(response => response.json())
        .then(assignments => {
            assignments.forEach(course => {
                course.assignments.forEach(assignment => {
                    addAssignmentFromData(assignment, course.courseId);
                });
            });
        }).catch(error => {
            console.error('Error fetching assignments:', error);
            // Handle error (e.g., show an error message)
        });
    function addAssignmentFromData(assignment, courseId) {
        const name = `${assignment.title} (${courseId})`;
        const dueDate = assignment.dueDate;
        // Determine priority based on due date
        const priority = getPriority(dueDate);
        const listItem = createListItem(name, dueDate, priority);
    
        // Determine whether to add to regular or urgent list based on due date
        if (isUrgent(dueDate)) {
            urgentListContainer.appendChild(listItem);
        } else {
            regularListContainer.appendChild(listItem);
        }
    }
    function processFetchedAssignments(assignments) {
        assignments.forEach(course => {
            course.assignments.forEach(assignment => {
                const name = `${assignment.title} - ${course.courseId}`;
                const dueDate = assignment.dueDate;
                const priority = getPriority(dueDate);
                addAssignment(name, dueDate, priority);
            });
        });
    }
    // Fetching assignments data from the server
    fetch('/api/assignments')
    .then(response => response.json())
    .then(assignmentsData => processFetchedAssignments(assignmentsData))
    .catch(error => console.error('Error fetching assignments:', error));

});
