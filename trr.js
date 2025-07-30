let budgetData = [];
let originChart = null;
let destinationChart = null;

// Initialize charts
function initializeCharts() {
    const originCtx = document.getElementById('originChart').getContext('2d');
    originChart = new Chart(originCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#8B4513',  // 1ª fatia - Marrom (cor principal do tema)
                    '#CD853F',  // 2ª fatia - Peru
                    '#D2691E',  // 3ª fatia - Chocolate
                    '#A0522D',  // 4ª fatia - Sienna
                    '#DEB887',  // 5ª fatia - Burlywood
                    '#F4A460'
                ],
                borderWidth: 3,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed.toFixed(1);
                            return `${label}: ${value}% de execução`;
                        }
                    }
                }
            }
        }
    });

    const destinationCtx = document.getElementById('destinationChart').getContext('2d');
    destinationChart = new Chart(destinationCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Valor Executado (R$)',
                data: [],
                backgroundColor: '#CD853F',
                borderColor: '#5a67d8',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update charts based on current data
function updateCharts() {
    // Update origin chart (based on execution percentage by origin)
    const originData = {};
    const originTotals = {};
    
    // Calculate totals and executed values by origin
    budgetData.forEach(item => {
        const origem = item.origem;
        const orcamento = parseFloat(item.orcamentoPrevisto);
        const executado = parseFloat(item.valorExecutado);
        
        if (!originTotals[origem]) {
            originTotals[origem] = { orcamento: 0, executado: 0 };
        }
        
        originTotals[origem].orcamento += orcamento;
        originTotals[origem].executado += executado;
    });
    
    // Calculate execution percentage for each origin
    Object.keys(originTotals).forEach(origem => {
        const total = originTotals[origem];
        originData[origem] = total.orcamento > 0 ? (total.executado / total.orcamento * 100) : 0;
    });

    originChart.data.labels = Object.keys(originData);
    originChart.data.datasets[0].data = Object.values(originData);
    originChart.update();

    // Update destination chart (based on accumulated executed values by category)
    const categoryTotals = {};
    
    // Accumulate values for same categories
    budgetData.forEach(item => {
        const categoria = item.categoria;
        const executado = parseFloat(item.valorExecutado);
        
        if (!categoryTotals[categoria]) {
            categoryTotals[categoria] = 0;
        }
        
        categoryTotals[categoria] += executado;
    });

    const categories = Object.keys(categoryTotals);
    const executedValues = Object.values(categoryTotals);

    destinationChart.data.labels = categories;
    destinationChart.data.datasets[0].data = executedValues;
    destinationChart.update();
}

// Update budget table
function updateBudgetTable() {
    const tbody = document.getElementById('budgetTableBody');
    
    if (budgetData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">Nenhuma categoria adicionada ainda. Use o formulário acima para adicionar dados.</td></tr>';
        return;
    }

    tbody.innerHTML = budgetData.map((item, index) => {
        const orcamentoPrevisto = parseFloat(item.orcamentoPrevisto);
        const valorExecutado = parseFloat(item.valorExecutado);
        const execucaoPercent = orcamentoPrevisto > 0 ? (valorExecutado / orcamentoPrevisto * 100).toFixed(1) : 0;
        
        return `
            <tr>
                <td class="category" data-label="Categoria:">${item.categoria}</td>
                <td data-label="Origem:">${item.origem}</td>
                <td data-label="Orçamento Previsto:">R$ ${orcamentoPrevisto.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td data-label="Valor Executado:">R$ ${valorExecutado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td data-label="% Execução:">${execucaoPercent}%</td>
                <td data-label="Status:"><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                <td class="actions-cell" data-label="Ações:">
                    <button class="btn btn-edit" onclick="editCategory(${index})">Editar</button>
                    <button class="btn btn-danger" onclick="removeCategory(${index})">Remover</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Add new category
function addCategory(categoryData) {
    budgetData.push(categoryData);
    updateBudgetTable();
    updateCharts();
}

// Edit category
function editCategory(index) {
    const item = budgetData[index];
    
    // Fill form with existing data
    document.getElementById('categoria').value = item.categoria;
    document.getElementById('origemRecurso').value = item.origem;
    document.getElementById('orcamentoPrevisto').value = item.orcamentoPrevisto;
    document.getElementById('valorExecutado').value = item.valorExecutado;
    document.getElementById('status').value = item.status;
    
    // Change form button to update mode
    const form = document.getElementById('categoryForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Atualizar Categoria';
    submitBtn.style.background = [
        "background-color: rgba(226, 204, 174, 1)",
    "color: #000000",
    "padding: 8px 15px",
    "border-radius: 10px",
    "border: none",
    "font-size: 14px"
    ];
    
    // Store the index being edited
    form.dataset.editIndex = index;
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Update existing category
function updateCategory(index, categoryData) {
    budgetData[index] = categoryData;
    updateBudgetTable();
    updateCharts();
}

// Remove category
function removeCategory(index) {
    if (confirm('Tem certeza que deseja remover esta categoria?')) {
        budgetData.splice(index, 1);
        updateBudgetTable();
        updateCharts();
    }
}

// Form submission
document.getElementById('categoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const files = document.getElementById('documentos').files;
    
    // Validate that executed value doesn't exceed planned budget
    const orcamentoPrevisto = parseFloat(formData.get('orcamentoPrevisto'));
    const valorExecutado = parseFloat(formData.get('valorExecutado'));
    
    if (valorExecutado > orcamentoPrevisto) {
        if (!confirm('O valor executado é maior que o orçamento previsto. Deseja continuar?')) {
            return;
        }
    }
    
    const categoryData = {
        categoria: formData.get('categoria'),
        origem: formData.get('origemRecurso'),
        orcamentoPrevisto: formData.get('orcamentoPrevisto'),
        valorExecutado: formData.get('valorExecutado'),
        status: formData.get('status'),
        documentos: Array.from(files).map(file => file.name)
    };
    
    const editIndex = this.dataset.editIndex;
    
    if (editIndex !== undefined) {
        // Update existing category
        updateCategory(parseInt(editIndex), categoryData);
        delete this.dataset.editIndex;
        
        // Reset button to add mode
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Adicionar Categoria';
        submitBtn.style.background = '';
    } else {
        // Add new category
        addCategory(categoryData);
    }
    
    // Reset form
    this.reset();
    
    // Show success message
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    const isUpdate = editIndex !== undefined;
    btn.textContent = isUpdate ? 'Categoria Atualizada!' : 'Categoria Adicionada!';
    btn.style.background = [
    "background-color: rgba(226, 204, 174, 1)",
    "color: #000000",
    "padding: 8px 15px",
    "border-radius: 10px",
    "border: none",
    "font-size: 14px"
    ];
    
    setTimeout(() => {
        btn.textContent = 'Adicionar Categoria';
        btn.style.background = '';
    }, 2000);
});

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});
