// Array para armazenar as parcerias
        let partnerships = [];
        let editingId = null;


        // Função para formatar moeda
        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value || 0);
        }


        // Função para formatar data
        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('pt-BR');
        }


        // Função para obter rótulo do tipo
        function getTypeLabel(type) {
            const types = {
                'public': 'Público',
                'ong': 'ONG',
                'private': 'Privado'
            };
            return types[type] || type;
        }


        // Função para obter rótulo do status
        function getStatusLabel(status) {
            const statuses = {
                'active': 'Ativo',
                'renewal': 'Renovação'
            };
            return statuses[status] || status;
        }


        // Função para atualizar as estatísticas
        function updateStats() {
            const totalValue = partnerships.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
            const activeCount = partnerships.filter(p => p.status === 'active').length;
           
            document.getElementById('totalValue').textContent = formatCurrency(totalValue);
            document.getElementById('totalPartnerships').textContent = partnerships.length.toString();
            document.getElementById('activePartnerships').textContent = activeCount.toString();
        }


        // Função para renderizar a lista de parcerias
        function renderPartnerships() {
            const container = document.getElementById('partnershipsList');
           
            if (partnerships.length === 0) {
                container.innerHTML = '<div class="empty-state">Nenhuma parceria cadastrada ainda.</div>';
                return;
            }


            const html = partnerships.map(partnership => `
                <div class="partnership-item">
                    <div class="partnership-header">
                        <div class="partnership-name">${partnership.name}</div>
                        <div class="status-badge status-${partnership.status}">
                            ${getStatusLabel(partnership.status)}
                        </div>
                    </div>
                   
                    <div class="partnership-details">
                        <div class="detail-item">
                            <div class="detail-label">Valor</div>
                            <div class="detail-value">${formatCurrency(partnership.value)}</div>
                        </div>
                       
                        <div class="detail-item">
                            <div class="detail-label">Tipo</div>
                            <div class="detail-value">
                                <span class="type-badge type-${partnership.type}">
                                    ${getTypeLabel(partnership.type)}
                                </span>
                            </div>
                        </div>
                       
                        <div class="detail-item">
                            <div class="detail-label">Data de Início</div>
                            <div class="detail-value">${formatDate(partnership.startDate)}</div>
                        </div>
                       
                        ${partnership.endDate ? `
                        <div class="detail-item">
                            <div class="detail-label">Data de Término</div>
                            <div class="detail-value">${formatDate(partnership.endDate)}</div>
                        </div>
                        ` : ''}
                       
                        <div class="detail-item" style="grid-column: 1 / -1;">
                            <div class="detail-label">Objetivo</div>
                            <div class="detail-value">${partnership.objective}</div>
                        </div>
                    </div>
                   
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editPartnership(${partnership.id})">
                            ✏️ Editar
                        </button>
                        <button class="btn-delete" onclick="deletePartnership(${partnership.id})">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `).join('');
           
            container.innerHTML = html;
        }


        // Event listener para o formulário
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('partnershipForm');
            const editForm = document.getElementById('editPartnershipForm');
           
            form.addEventListener('submit', function(e) {
                e.preventDefault();
               
                // Capturar valores dos campos
                const name = document.getElementById('partnerName').value.trim();
                const value = document.getElementById('partnershipValue').value;
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                const type = document.getElementById('partnerType').value;
                const status = document.getElementById('status').value;
                const objective = document.getElementById('objective').value.trim();
               
                // Validar campos obrigatórios
                if (!name || !value || !startDate || !type || !status || !objective) {
                    alert('Por favor, preencha todos os campos obrigatórios (marcados com *).');
                    return;
                }
               
                // Criar objeto da parceria
                const partnership = {
                    id: Date.now(),
                    name: name,
                    value: parseFloat(value),
                    startDate: startDate,
                    endDate: endDate || null,
                    type: type,
                    status: status,
                    objective: objective
                };
               
                // Adicionar à lista
                partnerships.push(partnership);
               
                // Atualizar interface
                updateStats();
                renderPartnerships();
               
                // Limpar formulário
                form.reset();
               
                // Mostrar mensagem de sucesso
                alert('Parceria cadastrada com sucesso!');
            });


            // Event listener para o formulário de edição
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
               
                if (!editingId) return;
               
                // Capturar valores dos campos de edição
                const name = document.getElementById('editPartnerName').value.trim();
                const value = document.getElementById('editPartnershipValue').value;
                const startDate = document.getElementById('editStartDate').value;
                const endDate = document.getElementById('editEndDate').value;
                const type = document.getElementById('editPartnerType').value;
                const status = document.getElementById('editStatus').value;
                const objective = document.getElementById('editObjective').value.trim();
               
                // Validar campos obrigatórios
                if (!name || !value || !startDate || !type || !status || !objective) {
                    alert('Por favor, preencha todos os campos obrigatórios (marcados com *).');
                    return;
                }
               
                // Encontrar e atualizar a parceria
                const index = partnerships.findIndex(p => p.id === editingId);
                if (index !== -1) {
                    partnerships[index] = {
                        id: editingId,
                        name: name,
                        value: parseFloat(value),
                        startDate: startDate,
                        endDate: endDate || null,
                        type: type,
                        status: status,
                        objective: objective
                    };
                   
                    // Atualizar interface
                    updateStats();
                    renderPartnerships();
                   
                    // Fechar modal
                    closeEditModal();
                   
                    // Mostrar mensagem de sucesso
                    alert('Parceria atualizada com sucesso!');
                }
            });
           
            // Inicializar interface
            updateStats();
            renderPartnerships();
        });


        // Função para editar parceria
        function editPartnership(id) {
            const partnership = partnerships.find(p => p.id === id);
            if (!partnership) return;
           
            editingId = id;
           
            // Preencher os campos do modal com os dados da parceria
            document.getElementById('editPartnerName').value = partnership.name;
            document.getElementById('editPartnershipValue').value = partnership.value;
            document.getElementById('editStartDate').value = partnership.startDate;
            document.getElementById('editEndDate').value = partnership.endDate || '';
            document.getElementById('editPartnerType').value = partnership.type;
            document.getElementById('editStatus').value = partnership.status;
            document.getElementById('editObjective').value = partnership.objective;
           
            // Mostrar modal
            document.getElementById('editModal').style.display = 'block';
        }


        // Função para fechar modal de edição
        function closeEditModal() {
            document.getElementById('editModal').style.display = 'none';
            editingId = null;
            document.getElementById('editPartnershipForm').reset();
        }


        // Função para excluir parceria
        function deletePartnership(id) {
            const partnership = partnerships.find(p => p.id === id);
            if (!partnership) return;
           
            if (confirm(`Tem certeza que deseja excluir a parceria com "${partnership.name}"?`)) {
                partnerships = partnerships.filter(p => p.id !== id);
                updateStats();
                renderPartnerships();
                alert('Parceria excluída com sucesso!');
            }
        }


        // Fechar modal quando clicar fora dele
        window.onclick = function(event) {
            const modal = document.getElementById('editModal');
            if (event.target === modal) {
                closeEditModal();
            }
        }
