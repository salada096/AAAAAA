// ============================================
// CÓDIGO JAVASCRIPT CORRIGIDO E OTIMIZADO
// CORREÇÃO ESPECÍFICA PARA SIDEBAR MOBILE
// ============================================

(function() {
  'use strict';

  // Variáveis globais
  let modalOverlay = null;
  let sidebarOverlay = null;

  // ============================================
  // INICIALIZAÇÃO PRINCIPAL
  // ============================================
  document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM carregado - iniciando configurações...');
    
    try {
      initializeApp();
    } catch (error) {
      console.error('Erro na inicialização:', error);
    }
  });

  function initializeApp() {
    // Configurações principais
    setupProfileDropdown();
    setupNavbarCollapse();
    setupSocialMediaModals();
    setupImageUploads();
    setupSidebar();
    setupSubmenuToggle();
    loadSavedData();

    // Event listeners para redimensionamento
    window.addEventListener("resize", debounce(handleResize, 250));
  }

  // ============================================
  // CONFIGURAÇÃO DO DROPDOWN DE PERFIL
  // ============================================
  function setupProfileDropdown() {
    const usuarioBtn = document.getElementById("usuario");
    const dropdownMenu = document.getElementById("dropzinho");
    
    if (!usuarioBtn || !dropdownMenu) {
      console.warn('Elementos do dropdown não encontrados');
      return;
    }

    // Limpar event listeners existentes
    usuarioBtn.replaceWith(usuarioBtn.cloneNode(true));
    const newUsuarioBtn = document.getElementById("usuario");
    
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      setupMobileDropdown(newUsuarioBtn, dropdownMenu);
    } else {
      setupDesktopDropdown(newUsuarioBtn, dropdownMenu);
    }

    // Event listener para itens do dropdown
    setupDropdownItems(dropdownMenu);
  }

  function setupMobileDropdown(btn, dropdown) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(dropdown);
    });

    document.addEventListener("click", function(e) {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        hideDropdown(dropdown);
      }
    });
  }

  function setupDesktopDropdown(btn, dropdown) {
    const profileDropdown = document.querySelector(".profile-dropdown");
    
    if (profileDropdown) {
      profileDropdown.addEventListener("mouseenter", () => showDropdown(dropdown));
      profileDropdown.addEventListener("mouseleave", () => hideDropdown(dropdown));
    }

    btn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(dropdown);
    });
  }

  function setupDropdownItems(dropdown) {
    const items = dropdown.querySelectorAll('.dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', () => hideDropdown(dropdown));
    });
  }

  function showDropdown(dropdown) {
    dropdown.style.display = "block";
  }

  function hideDropdown(dropdown) {
    dropdown.style.display = "none";
  }

  function toggleDropdown(dropdown) {
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }

  // ============================================
  // CONFIGURAÇÃO DA NAVBAR - CORRIGIDA
  // ============================================
  function setupNavbarCollapse() {
    const navbarCollapse = document.getElementById('navbarNav');
    const toggleButton = document.getElementById('icone');
    
    if (!navbarCollapse || !toggleButton) {
      console.warn('Elementos da navbar não encontrados');
      return;
    }

    console.log('Configurando navbar collapse...');

    // Remover event listeners antigos
    const newToggleButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

    // Verificar se Bootstrap está disponível
    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
      console.log('Usando Bootstrap collapse...');
      setupBootstrapCollapse(navbarCollapse, newToggleButton);
    }
    // Verificar se jQuery está disponível
    else if (typeof $ !== 'undefined' && $.fn.collapse) {
      console.log('Usando jQuery collapse...');
      setupJQueryCollapse(navbarCollapse, newToggleButton);
    }
    // Fallback para Vanilla JS
    else {
      console.log('Usando Vanilla JS collapse...');
      setupVanillaCollapse(navbarCollapse, newToggleButton);
    }

    // Event listener adicional para fechar navbar quando clicar em links
    setupNavbarLinkClosing(navbarCollapse);
  }

  function setupBootstrapCollapse(navbar, toggle) {
    // Inicializar Bootstrap Collapse se não existir
    let collapseInstance = bootstrap.Collapse.getInstance(navbar);
    if (!collapseInstance) {
      collapseInstance = new bootstrap.Collapse(navbar, { 
        toggle: false,
        parent: false
      });
    }
    
    // Event listeners para mudanças de estado
    navbar.addEventListener('shown.bs.collapse', function() {
      console.log('Navbar aberta');
      updateToggleState(toggle, true);
      toggle.classList.add('collapsed');
    });

    navbar.addEventListener('hidden.bs.collapse', function() {
      console.log('Navbar fechada');
      updateToggleState(toggle, false);
      toggle.classList.remove('collapsed');
    });

    // Click handler para o botão toggle
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Toggle clicked, navbar classes:', navbar.classList.toString());
      
      const isShown = navbar.classList.contains('show') || navbar.classList.contains('showing');
      
      if (isShown) {
        collapseInstance.hide();
      } else {
        collapseInstance.show();
      }
    });
  }

  function setupJQueryCollapse(navbar, toggle) {
    const $navbar = $(navbar);
    
    $navbar.on('shown.bs.collapse', function() {
      console.log('Navbar aberta (jQuery)');
      updateToggleState(toggle, true);
    });

    $navbar.on('hidden.bs.collapse', function() {
      console.log('Navbar fechada (jQuery)');
      updateToggleState(toggle, false);
    });

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Toggle clicked (jQuery)');
      $navbar.collapse('toggle');
    });
  }

  function setupVanillaCollapse(navbar, toggle) {
    // Configurar estado inicial
    navbar.style.transition = 'all 0.35s ease';
    
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Toggle clicked (Vanilla JS)');
      
      const isVisible = navbar.classList.contains('show');
      
      if (isVisible) {
        // Fechar navbar
        navbar.style.height = navbar.scrollHeight + 'px';
        requestAnimationFrame(() => {
          navbar.style.height = '0px';
          navbar.style.overflow = 'hidden';
        });
        
        setTimeout(() => {
          navbar.classList.remove('show');
          navbar.style.height = '';
          navbar.style.overflow = '';
          updateToggleState(toggle, false);
        }, 350);
      } else {
        // Abrir navbar
        navbar.classList.add('show');
        navbar.style.height = '0px';
        navbar.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
          navbar.style.height = navbar.scrollHeight + 'px';
        });
        
        setTimeout(() => {
          navbar.style.height = '';
          navbar.style.overflow = '';
          updateToggleState(toggle, true);
        }, 350);
      }
    });
  }

  function setupNavbarLinkClosing(navbar) {
    // Fechar navbar ao clicar em links (apenas em mobile)
    const navLinks = navbar.querySelectorAll('.nav-link, .dropdown-item');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          // Fechar navbar após um pequeno delay
          setTimeout(() => {
            if (navbar.classList.contains('show')) {
              // Usar o método apropriado baseado na biblioteca disponível
              if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                const collapseInstance = bootstrap.Collapse.getInstance(navbar);
                if (collapseInstance) {
                  collapseInstance.hide();
                }
              } else if (typeof $ !== 'undefined' && $.fn.collapse) {
                $(navbar).collapse('hide');
              } else {
                navbar.classList.remove('show');
                const toggle = document.getElementById('icone');
                if (toggle) {
                  updateToggleState(toggle, false);
                }
              }
            }
          }, 100);
        }
      });
    });
  }

  function updateToggleState(toggle, expanded) {
    if (!toggle) return;
    
    toggle.setAttribute('aria-expanded', expanded.toString());
    
    if (expanded) {
      toggle.classList.add('collapsed');
    } else {
      toggle.classList.remove('collapsed');
    }
    
    console.log('Toggle state updated:', {
      expanded: expanded,
      ariaExpanded: toggle.getAttribute('aria-expanded'),
      hasCollapsedClass: toggle.classList.contains('collapsed')
    });
  }

  // ============================================
  // CONFIGURAÇÃO DOS MODAIS DE REDES SOCIAIS
  // ============================================
  function setupSocialMediaModals() {
    setupInstagramModal();
    setupFacebookModal();
    createModalOverlay();
  }

  function setupInstagramModal() {
    const btn = document.getElementById("botao");
    const modal = document.getElementById("caixa-principal");
    const exitBtn = document.getElementById("botao-sair");
    const confirmBtn = document.getElementById("botaocaixa");
    const editBtn = document.getElementById("editarLink");

    if (!btn || !modal || !exitBtn) return;

    btn.addEventListener("click", () => openModal(modal));
    exitBtn.addEventListener("click", () => closeModal(modal));
    
    if (confirmBtn) {
      confirmBtn.addEventListener("click", gerarLinkInstagram);
    }
    
    if (editBtn) {
      editBtn.addEventListener("click", editInstagramLink);
    }
  }

  function setupFacebookModal() {
    const btn = document.getElementById("facebook");
    const modal = document.getElementById("caixa-principal2");
    const exitBtn = document.getElementById("botao-sair2");
    const confirmBtn = document.getElementById("botaocaixa2");
    const editBtn = document.getElementById("editarLink2");

    if (!btn || !modal || !exitBtn) return;

    btn.addEventListener("click", () => openModal(modal));
    exitBtn.addEventListener("click", () => closeModal(modal));
    
    if (confirmBtn) {
      confirmBtn.addEventListener("click", gerarLinkFacebook);
    }
    
    if (editBtn) {
      editBtn.addEventListener("click", editFacebookLink);
    }
  }

  function createModalOverlay() {
    if (modalOverlay) return modalOverlay;

    modalOverlay = document.createElement("div");
    modalOverlay.id = "modal-overlay";
    modalOverlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 1000;
    `;
    
    document.body.appendChild(modalOverlay);
    return modalOverlay;
  }

  function openModal(modal) {
    if (!modal || !modalOverlay) return;
    
    modal.style.display = "flex";
    modalOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal || !modalOverlay) return;
    
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // ============================================
  // FUNÇÕES DE REDES SOCIAIS
  // ============================================
  function gerarLinkInstagram() {
    const input = document.getElementById("instagram");
    const linkContainer = document.getElementById("linkContainer");
    const editBtn = document.getElementById("editarLink");
    const confirmBtn = document.getElementById("botaocaixa");
    const socialBtn = document.getElementById("botao");
    const textElement = document.getElementById("texto-caixa3");

    if (!input || !linkContainer) return;

    const username = input.value.trim();
    if (!isValidSocialUsername(username)) {
      showAlert("Por favor, insira um Instagram válido (somente letras, números, pontos e underlines).");
      return;
    }

    const cleanUsername = username.replace(/^@/, "");
    const link = `https://www.instagram.com/${cleanUsername}`;

    updateSocialLink(linkContainer, link, socialBtn, "Instagram");
    toggleSocialElements(input, confirmBtn, editBtn, false);
    
    if (textElement) {
      textElement.textContent = "Aqui você pode editar o Instagram da sua empresa!";
    }
    
    input.value = "";
  }

  function gerarLinkFacebook() {
    const input = document.getElementById("facebook2");
    const linkContainer = document.getElementById("linkContainer2");
    const editBtn = document.getElementById("editarLink2");
    const confirmBtn = document.getElementById("botaocaixa2");
    const socialBtn = document.getElementById("facebook");
    const textElement = document.getElementById("texto-caixa4");

    if (!input || !linkContainer) return;

    const username = input.value.trim();
    if (!isValidSocialUsername(username)) {
      showAlert("Por favor, insira um Facebook válido (somente letras, números, pontos e underlines).");
      return;
    }

    const cleanUsername = username.replace(/^@/, "");
    const link = `https://www.facebook.com/${cleanUsername}`;

    updateSocialLink(linkContainer, link, socialBtn, "Facebook");
    toggleSocialElements(input, confirmBtn, editBtn, false);
    
    if (textElement) {
      textElement.textContent = "Aqui você pode editar o Facebook da sua empresa!";
    }
    
    input.value = "";
  }

  function editInstagramLink() {
    const input = document.getElementById("instagram");
    const linkContainer = document.getElementById("linkContainer");
    const confirmBtn = document.getElementById("botaocaixa");
    const editBtn = document.getElementById("editarLink");

    toggleSocialElements(input, confirmBtn, editBtn, true);
    linkContainer.innerHTML = "";
  }

  function editFacebookLink() {
    const input = document.getElementById("facebook2");
    const linkContainer = document.getElementById("linkContainer2");
    const confirmBtn = document.getElementById("botaocaixa2");
    const editBtn = document.getElementById("editarLink2");

    toggleSocialElements(input, confirmBtn, editBtn, true);
    linkContainer.innerHTML = "";
  }

  function isValidSocialUsername(username) {
    const regex = /^[a-zA-Z0-9._]+$/;
    return username && regex.test(username.replace(/^@/, ""));
  }

  function updateSocialLink(container, link, button, platform) {
    container.innerHTML = `
      <div style="text-align: center;">
        <a href="${link}" target="_blank" style="color:#EC9E07; font-size:16px; word-wrap:break-word;">
          ${link}
        </a>
      </div>
    `;
    
    if (button) {
      button.setAttribute("href", link);
      button.innerHTML = platform;
    }
  }

  function toggleSocialElements(input, confirmBtn, editBtn, show) {
    if (input) input.style.display = show ? "block" : "none";
    if (confirmBtn) confirmBtn.style.display = show ? "block" : "none";
    if (editBtn) editBtn.style.display = show ? "none" : "inline-block";
  }

  function showAlert(message) {
    alert(message);
  }

  // ============================================
  // CONFIGURAÇÃO DE UPLOAD DE IMAGENS
  // ============================================
  function setupImageUploads() {
    setupImagePreview("imageUpload", "imgheader", "btnn", "headerLogo");
    setupImagePreview("imgUpload", "imgfooter", "btnn2", "footerLogo");
    setupUserPhotoUpload();
  }

  function setupImagePreview(inputId, containerId, buttonIconId, storageKey) {
    const fileInput = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    const buttonIcon = document.getElementById(buttonIconId);

    if (!fileInput || !container) return;

    fileInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          createImagePreview(container, e.target.result, buttonIcon, storageKey);
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  function setupUserPhotoUpload() {
    const userIcon = document.getElementById("userIcon");
    if (!userIcon) return;

    let userPhotoInput = document.getElementById('userPhotoInput');
    if (!userPhotoInput) {
      userPhotoInput = document.createElement('input');
      userPhotoInput.type = 'file';
      userPhotoInput.id = 'userPhotoInput';
      userPhotoInput.accept = 'image/*';
      userPhotoInput.style.display = 'none';
      document.body.appendChild(userPhotoInput);
    }

    userIcon.addEventListener("click", function(e) {
      e.preventDefault();
      userPhotoInput.click();
    });

    userPhotoInput.addEventListener("change", function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          updateUserPhoto(e.target.result);
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  function createImagePreview(container, imageData, buttonIcon, storageKey) {
    if (buttonIcon) buttonIcon.style.display = "none";

    const existingPreview = container.querySelector('.image-preview');
    if (existingPreview) {
      container.removeChild(existingPreview);
    }

    const previewElement = document.createElement('div');
    previewElement.className = 'image-preview';
    previewElement.style.cssText = `
      width: 100%;
      height: 100%;
      background-image: url(${imageData});
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      border-radius: 5px;
    `;

    container.style.position = "relative";
    container.style.overflow = "hidden";

    const removeButton = createRemoveButton(() => {
      container.removeChild(previewElement);
      if (buttonIcon) buttonIcon.style.display = "inline-block";
      if (storageKey) removeFromStorage(storageKey);
    });

    previewElement.appendChild(removeButton);
    container.appendChild(previewElement);

    if (storageKey) saveToStorage(storageKey, imageData);
  }

  function createRemoveButton(clickHandler) {
    const button = document.createElement('button');
    button.textContent = "✕";
    button.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 2;
      background: rgba(255, 255, 255, 0.7);
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      padding: 0;
      font-size: 12px;
    `;
    
    button.addEventListener("click", function(e) {
      e.stopPropagation();
      clickHandler();
    });
    
    return button;
  }

  function updateUserPhoto(imageData) {
    const userPhoto = document.getElementById("userPhoto");
    const userIcon = document.getElementById("userIcon");
    
    if (userPhoto) {
      userPhoto.src = imageData;
      userPhoto.style.display = "inline-block";
      
      if (userIcon) {
        userIcon.style.display = "none";
      }
      
      saveToStorage('userProfilePhoto', imageData);
    }
  }

  // ============================================
  // CONFIGURAÇÃO DA SIDEBAR - CORRIGIDA PARA MOBILE
  // ============================================
  function setupSidebar() {
    const toggleBtn = document.getElementById("icone2");
    if (toggleBtn) {
      // Limpar event listeners existentes
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
      
      // Adicionar event listener ao novo botão
      newToggleBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Sidebar toggle clicked');
        toggleSidebar();
      });
    }
    
    handleSidebarHover();
    ensureSidebarHeight();
  }

  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;
    
    if (!sidebar) {
      console.warn('Sidebar não encontrada');
      return;
    }

    console.log('Toggleando sidebar, estado atual:', sidebar.classList.contains("open"));

    const wasOpen = sidebar.classList.contains("open");
    
    // Criar overlay se não existir
    if (!sidebarOverlay) {
      createSidebarOverlay();
    }

    if (wasOpen) {
      // Fechar sidebar
      sidebar.classList.remove("open");
      body.classList.remove("sidebar-open");
      sidebarOverlay.style.display = "none";
      document.body.style.overflow = "auto";
      
      // Fechar todos os submenus
      closeAllSubmenus();
      
      console.log('Sidebar fechada');
    } else {
      // Abrir sidebar
      sidebar.classList.add("open");
      body.classList.add("sidebar-open");
      sidebarOverlay.style.display = "block";
      document.body.style.overflow = "hidden";
      
      // Mostrar logo se estiver em mobile
      const imgHeader = document.getElementById("imgheader");
      if (imgHeader && window.innerWidth <= 768) {
        imgHeader.style.visibility = "visible";
        imgHeader.style.opacity = "1";
      }
      
      console.log('Sidebar aberta');
    }
  }

  // FUNÇÃO CORRIGIDA: Fechar todos os submenus
  function closeAllSubmenus() {
    // Fechar submenu de QR Code
    const submenuQrcode = document.getElementById("submenu-qrcode");
    const arrow = document.querySelector(".menu-arrow");
    
    if (submenuQrcode) {
      submenuQrcode.style.display = "none";
    }
    
    if (arrow) {
      arrow.classList.remove("bi-chevron-down");
      arrow.classList.add("bi-chevron-right");
    }
    
    // Fechar outros submenus se existirem
    const submenuPontos = document.getElementById('submenu-pontos');
    if (submenuPontos) {
      submenuPontos.classList.remove('open');
    }
    
    // Fechar qualquer outro submenu que possa existir
    const allSubmenus = document.querySelectorAll('[id^="submenu-"]');
    allSubmenus.forEach(submenu => {
      if (submenu.style) {
        submenu.style.display = "none";
      }
      submenu.classList.remove('open');
    });
  }

  function createSidebarOverlay() {
    if (sidebarOverlay) return sidebarOverlay;

    sidebarOverlay = document.createElement("div");
    sidebarOverlay.id = "sidebar-overlay";
    sidebarOverlay.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 650;
      touch-action: none;
    `;
    
    // Event listeners para fechar sidebar
    sidebarOverlay.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Overlay clicked, fechando sidebar');
      toggleSidebar();
    });
    
    // Prevenir scroll no fundo quando overlay está ativo
    sidebarOverlay.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });
    
    document.body.appendChild(sidebarOverlay);
    return sidebarOverlay;
  }

  function handleSidebarHover() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;
    const imgHeader = document.getElementById("imgheader");
    
    if (!sidebar) return;

    // Remover listeners existentes
    if (sidebar._mouseenterListener) {
      sidebar.removeEventListener("mouseenter", sidebar._mouseenterListener);
    }
    if (sidebar._mouseleaveListener) {
      sidebar.removeEventListener("mouseleave", sidebar._mouseleaveListener);
    }

    const isTablet = window.innerWidth > 768 && window.innerWidth <= 992;
    const isMobile = window.innerWidth <= 768;
    
    // Apenas aplicar hover em desktop (não mobile nem tablet)
    if (!isTablet && !isMobile && window.innerWidth > 992) {
      const mouseenterListener = function() {
        if (!sidebar.classList.contains("open")) { // Só expandir se não estiver aberta
          body.classList.add("sidebar-expanded");
          if (imgHeader) {
            imgHeader.style.visibility = "visible";
            imgHeader.style.opacity = "1";
          }
        }
      };
      
      const mouseleaveListener = function() {
        if (!sidebar.classList.contains("open")) { // Só contrair se não estiver aberta
          body.classList.remove("sidebar-expanded");
          closeAllSubmenus();
        }
      };
      
      sidebar.addEventListener("mouseenter", mouseenterListener);
      sidebar.addEventListener("mouseleave", mouseleaveListener);
      
      sidebar._mouseenterListener = mouseenterListener;
      sidebar._mouseleaveListener = mouseleaveListener;
    } else if (isTablet && imgHeader) {
      // Em tablet, sempre mostrar logo
      imgHeader.style.visibility = "visible";
      imgHeader.style.opacity = "1";
    }
  }

  function ensureSidebarHeight() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || window.innerWidth > 768) return;

    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    sidebar.style.height = Math.max(docHeight, window.innerHeight) + "px";
  }

  // ============================================
  // CONFIGURAÇÃO DO SUBMENU - MELHORADA
  // ============================================
  function setupSubmenuToggle() {
    // Configurar toggle do submenu principal
    window.toggleSubmenu = function() {
      const submenu = document.getElementById('submenu-pontos');
      const arrow = document.querySelector('.menu-arrow');
      
      if (!submenu) return;
      
      if (submenu.classList.contains('open')) {
        submenu.classList.remove('open');
        if (arrow) arrow.classList.remove('rotated');
      } else {
        submenu.classList.add('open');
        if (arrow) arrow.classList.add('rotated');
      }
    };

    // FUNÇÃO MELHORADA: Toggle do submenu de QR Code
    window.togglePontosColetaSubmenu = function() {
      const submenu = document.getElementById("submenu-qrcode");
      const arrow = document.querySelector(".menu-arrow");

      if (!submenu) {
        console.warn('Submenu QR Code não encontrado');
        return;
      }

      const isCurrentlyOpen = submenu.style.display === "block";

      if (isCurrentlyOpen) {
        // Fechar submenu
        submenu.style.display = "none";
        if (arrow) {
          arrow.classList.remove("bi-chevron-down");
          arrow.classList.add("bi-chevron-right");
        }
        console.log('Submenu QR Code fechado');
      } else {
        // Abrir submenu
        submenu.style.display = "block";
        if (arrow) {
          arrow.classList.remove("bi-chevron-right");
          arrow.classList.add("bi-chevron-down");
        }
        console.log('Submenu QR Code aberto');
      }
    };
  }

  // ============================================
  // GERENCIAMENTO DE ARMAZENAMENTO
  // ============================================
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }

  function getFromStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  function removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Erro ao remover do localStorage:', error);
    }
  }

   function loadSavedData() {
    loadSavedImages();
  }   
  
  function loadSavedImages() {
    const headerLogo = getFromStorage('headerLogo');
    if (headerLogo) {
      const container = document.getElementById('imgheader');
      const buttonIcon = document.getElementById('btnn');
      if (container) {
        createImagePreview(container, headerLogo, buttonIcon, 'headerLogo');
      }
    }

    const footerLogo = getFromStorage('footerLogo');
    if (footerLogo) {
      const container = document.getElementById('imgfooter');
      const buttonIcon = document.getElementById('btnn2');
      if (container) {
        createImagePreview(container, footerLogo, buttonIcon, 'footerLogo');
      }
    }

    const profilePhoto = getFromStorage('userProfilePhoto');
    if (profilePhoto) {
      updateUserPhoto(profilePhoto);
    }
  }

  // ============================================
  // UTILITÁRIOS
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function handleResize() {
    setupProfileDropdown();
    handleSidebarHover();
    ensureSidebarHeight();
  }

  // ============================================
  // EXPOSIÇÃO DE FUNÇÕES GLOBAIS
  // ============================================
  window.toggleSidebar = toggleSidebar;
  window.gerarLinkInstagram = gerarLinkInstagram;
  window.gerarLinkFacebook = gerarLinkFacebook;

})();
