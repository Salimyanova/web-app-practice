// ========== ДАННЫЕ ДЛЯ ПРИМЕРА (localStorage) ==========
// Инициализация данных, если их нет

let requests = [];
let clients = [];
let services = [];

// Загрузка данных из localStorage
function loadData() {
    const savedRequests = localStorage.getItem('risi_requests');
    const savedClients = localStorage.getItem('risi_clients');
    const savedServices = localStorage.getItem('risi_services');
    
    if (savedRequests) {
        requests = JSON.parse(savedRequests);
    } else {
        // Примеры заявок
        requests = [
            { id: 1, title: 'Разработка сайта для ООО "ТехноСервис"', client: 'ООО "ТехноСервис"', service: 'Веб-разработка', status: 'В работе', date: '2026-02-20', description: 'Требуется разработать корпоративный сайт с каталогом' },
            { id: 2, title: 'Настройка сервера', client: 'ИП Иванов', service: 'Системное администрирование', status: 'Новая', date: '2026-02-25', description: 'Настройка сервера Ubuntu + Nginx' },
            { id: 3, title: 'Дизайн логотипа', client: 'ООО "Старт"', service: 'Дизайн', status: 'Выполнена', date: '2026-02-18', description: 'Разработка логотипа для стартапа' },
        ];
    }
    
    if (savedClients) {
        clients = JSON.parse(savedClients);
    } else {
        clients = [
            { id: 1, name: 'ООО "ТехноСервис"', contact: 'info@tehno.ru', phone: '+7 (495) 123-45-67' },
            { id: 2, name: 'ИП Иванов', contact: 'ivanov@mail.ru', phone: '+7 (916) 234-56-78' },
            { id: 3, name: 'ООО "Старт"', contact: 'hello@start.ru', phone: '+7 (495) 987-65-43' },
        ];
    }
    
    if (savedServices) {
        services = JSON.parse(savedServices);
    } else {
        services = [
            { id: 1, name: 'Веб-разработка', price: 'от 50 000 руб', duration: '14-30 дней' },
            { id: 2, name: 'Дизайн', price: 'от 30 000 руб', duration: '7-14 дней' },
            { id: 3, name: 'Системное администрирование', price: 'от 10 000 руб/мес', duration: 'постоянно' },
        ];
    }
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('risi_requests', JSON.stringify(requests));
    localStorage.setItem('risi_clients', JSON.stringify(clients));
    localStorage.setItem('risi_services', JSON.stringify(services));
}

// ========== ОТОБРАЖЕНИЕ ЗАЯВОК ==========
function renderRequests() {
    const filter = document.getElementById('statusFilter')?.value || 'all';
    const container = document.getElementById('requestsList');
    if (!container) return;
    
    let filteredRequests = requests;
    if (filter !== 'all') {
        filteredRequests = requests.filter(r => r.status === filter);
    }
    
    if (filteredRequests.length === 0) {
        container.innerHTML = '<div class="request-card" style="text-align: center; color: #999;">Нет заявок</div>';
        return;
    }
    
    container.innerHTML = filteredRequests.map(request => {
        let statusClass = '';
        switch(request.status) {
            case 'Новая': statusClass = 'status-new'; break;
            case 'В работе': statusClass = 'status-work'; break;
            case 'Выполнена': statusClass = 'status-done'; break;
            case 'Закрыта': statusClass = 'status-closed'; break;
            default: statusClass = 'status-new';
        }
        
        return `
            <div class="request-card" data-id="${request.id}">
                <div class="request-header">
                    <div class="request-title">${escapeHtml(request.title)}</div>
                    <div class="request-status ${statusClass}">${request.status}</div>
                </div>
                <div class="request-info">
                    📌 Клиент: ${escapeHtml(request.client)}<br>
                    🛠 Услуга: ${escapeHtml(request.service)}<br>
                    📅 Дата создания: ${request.date}<br>
                    📝 Описание: ${escapeHtml(request.description.substring(0, 100))}${request.description.length > 100 ? '...' : ''}
                </div>
                <div class="request-actions">
                    <button class="btn btn-warning change-status-btn" data-id="${request.id}">📊 Сменить статус</button>
                    <button class="btn btn-danger delete-request-btn" data-id="${request.id}">🗑 Удалить</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Добавляем обработчики для кнопок
    document.querySelectorAll('.change-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            changeRequestStatus(id);
        });
    });
    
    document.querySelectorAll('.delete-request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            deleteRequest(id);
        });
    });
}

// Смена статуса заявки
function changeRequestStatus(id) {
    const request = requests.find(r => r.id === id);
    if (!request) return;
    
    const statuses = ['Новая', 'В работе', 'Выполнена', 'Закрыта'];
    let currentIndex = statuses.indexOf(request.status);
    let nextIndex = (currentIndex + 1) % statuses.length;
    request.status = statuses[nextIndex];
    
    saveData();
    renderRequests();
}

// Удаление заявки
function deleteRequest(id) {
    if (confirm('Удалить заявку?')) {
        requests = requests.filter(r => r.id !== id);
        saveData();
        renderRequests();
    }
}

// ========== ОТОБРАЖЕНИЕ КЛИЕНТОВ ==========
function renderClients() {
    const container = document.getElementById('clientsList');
    if (!container) return;
    
    if (clients.length === 0) {
        container.innerHTML = '<div class="client-card" style="text-align: center; color: #999;">Нет клиентов</div>';
        return;
    }
    
    container.innerHTML = clients.map(client => `
        <div class="client-card" data-id="${client.id}">
            <div class="request-header">
                <div class="request-title">${escapeHtml(client.name)}</div>
                <button class="btn btn-danger delete-client-btn" data-id="${client.id}">🗑 Удалить</button>
            </div>
            <div class="request-info">
                📧 Email: ${escapeHtml(client.contact)}<br>
                📞 Телефон: ${escapeHtml(client.phone)}
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-client-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            deleteClient(id);
        });
    });
}

function deleteClient(id) {
    if (confirm('Удалить клиента?')) {
        clients = clients.filter(c => c.id !== id);
        saveData();
        renderClients();
    }
}

// ========== ОТОБРАЖЕНИЕ УСЛУГ ==========
function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    if (services.length === 0) {
        container.innerHTML = '<div class="service-card" style="text-align: center; color: #999;">Нет услуг</div>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card" data-id="${service.id}">
            <div class="request-header">
                <div class="request-title">${escapeHtml(service.name)}</div>
                <button class="btn btn-danger delete-service-btn" data-id="${service.id}">🗑 Удалить</button>
            </div>
            <div class="request-info">
                💰 Стоимость: ${escapeHtml(service.price)}<br>
                ⏱ Срок выполнения: ${escapeHtml(service.duration)}
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.delete-service-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            deleteService(id);
        });
    });
}

function deleteService(id) {
    if (confirm('Удалить услугу?')) {
        services = services.filter(s => s.id !== id);
        saveData();
        renderServices();
    }
}

// ========== МОДАЛЬНОЕ ОКНО ==========
let modalType = '';
let modalCallback = null;

function openModal(title, type, callback) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = title;
    modalType = type;
    modalCallback = callback;
    
    if (type === 'request') {
        modalBody.innerHTML = `
            <label>Название заявки:</label>
            <input type="text" id="reqTitle" placeholder="Например: Разработка сайта">
            <label>Клиент:</label>
            <select id="reqClient">
                ${clients.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join('')}
                ${clients.length === 0 ? '<option>Нет клиентов, сначала добавьте клиента</option>' : ''}
            </select>
            <label>Услуга:</label>
            <select id="reqService">
                ${services.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('')}
                ${services.length === 0 ? '<option>Нет услуг, сначала добавьте услугу</option>' : ''}
            </select>
            <label>Описание:</label>
            <textarea id="reqDesc" rows="3" placeholder="Подробное описание задачи..."></textarea>
        `;
    } else if (type === 'client') {
        modalBody.innerHTML = `
            <label>Название компании / Имя:</label>
            <input type="text" id="clientName" placeholder="Например: ООО Ромашка">
            <label>Контактный email:</label>
            <input type="email" id="clientEmail" placeholder="info@example.com">
            <label>Телефон:</label>
            <input type="text" id="clientPhone" placeholder="+7 (999) 123-45-67">
        `;
    } else if (type === 'service') {
        modalBody.innerHTML = `
            <label>Название услуги:</label>
            <input type="text" id="serviceName" placeholder="Например: SEO-продвижение">
            <label>Стоимость:</label>
            <input type="text" id="servicePrice" placeholder="от 20 000 руб">
            <label>Срок выполнения:</label>
            <input type="text" id="serviceDuration" placeholder="7-14 дней">
        `;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// ========== ДОБАВЛЕНИЕ ==========
function addRequest() {
    const title = document.getElementById('reqTitle')?.value;
    const client = document.getElementById('reqClient')?.value;
    const service = document.getElementById('reqService')?.value;
    const description = document.getElementById('reqDesc')?.value;
    
    if (!title || !client || !service) {
        alert('Заполните все поля!');
        return false;
    }
    
    const newId = Math.max(0, ...requests.map(r => r.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    requests.push({
        id: newId,
        title: title,
        client: client,
        service: service,
        status: 'Новая',
        date: today,
        description: description || 'Нет описания'
    });
    
    saveData();
    renderRequests();
    return true;
}

function addClient() {
    const name = document.getElementById('clientName')?.value;
    const email = document.getElementById('clientEmail')?.value;
    const phone = document.getElementById('clientPhone')?.value;
    
    if (!name) {
        alert('Введите название клиента!');
        return false;
    }
    
    const newId = Math.max(0, ...clients.map(c => c.id)) + 1;
    clients.push({
        id: newId,
        name: name,
        contact: email || 'не указан',
        phone: phone || 'не указан'
    });
    
    saveData();
    renderClients();
    return true;
}

function addService() {
    const name = document.getElementById('serviceName')?.value;
    const price = document.getElementById('servicePrice')?.value;
    const duration = document.getElementById('serviceDuration')?.value;
    
    if (!name) {
        alert('Введите название услуги!');
        return false;
    }
    
    const newId = Math.max(0, ...services.map(s => s.id)) + 1;
    services.push({
        id: newId,
        name: name,
        price: price || 'не указана',
        duration: duration || 'не указан'
    });
    
    saveData();
    renderServices();
    return true;
}

// ========== НАВИГАЦИЯ ПО ТАБАМ ==========
function setupTabs() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.tab');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            navBtns.forEach(b => b.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Перерисовываем данные при переключении
            if (tabId === 'requests') renderRequests();
            if (tabId === 'clients') renderClients();
            if (tabId === 'services') renderServices();
        });
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function init() {
    loadData();
    renderRequests();
    renderClients();
    renderServices();
    setupTabs();
    
    // Кнопки добавления
    document.getElementById('addRequestBtn')?.addEventListener('click', () => {
        if (clients.length === 0) {
            alert('Сначала добавьте клиентов!');
            return;
        }
        if (services.length === 0) {
            alert('Сначала добавьте услуги!');
            return;
        }
        openModal('Новая заявка', 'request', addRequest);
    });
    
    document.getElementById('addClientBtn')?.addEventListener('click', () => {
        openModal('Новый клиент', 'client', addClient);
    });
    
    document.getElementById('addServiceBtn')?.addEventListener('click', () => {
        openModal('Новая услуга', 'service', addService);
    });
    
    // Фильтр статусов
    document.getElementById('statusFilter')?.addEventListener('change', () => {
        renderRequests();
    });
    
    // Модальное окно
    document.querySelector('.close')?.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('modal')) closeModal();
    });
    
    document.getElementById('modalSaveBtn')?.addEventListener('click', () => {
        if (modalCallback && modalCallback()) {
            closeModal();
        }
    });
}

// Запуск при загрузке страницы
init();