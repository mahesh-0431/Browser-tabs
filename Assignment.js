// Model
let tabs = [{id:0,url:""}];


function addTabModel() {
  const tabId = tabs.length;
  tabs.push({ id: tabId, url: '' });
  return tabId;
}


function removeTabModel(tabId) {
  tabs = tabs.filter(tab => tab.id !== tabId);
}

function updateTabUrl(tabId, url) {
  tabs[tabId].url = url;
}

// View 
function renderTabsView() {
  $('.tab-container').empty();
  tabs.forEach((tab, index) => {
    const $tab = $(`
      <div class="tab${tab.active ? ' active' : ''}" data-id="${index}">
          tab
          <button class="close-btn">X</button>
      <div class="k${tab.active ? ' active' : ''}" data-id="${index}">
         <input type="text" class="address-bar" placeholder="Enter URL..." style="width:50vw">
      </div>
      </div>
    
    `);
    $('.tab-container').append($tab);
  });
}


function renderTabContentView(url) {
  $('.tab-content').empty();
  if (url) {
    if (url.startsWith('http')) {
      const $iframe = $('<iframe>', {
        src: url
      });
      $('.tab-content').append($iframe);
    } else {
      $('.tab-content').append(`<iframe src="${url}"></iframe>`);
    }
  }
}

// Controller 
function addTabController() {
  const tabId = addTabModel();
  renderTabsView();
  renderTabContentView('');
  switchTabController(tabId);
}


function removeTabController(tabId) {
  const removedTabIndex = tabs.findIndex(tab => tab.id === tabId);
  tabs.splice(removedTabIndex, 1);
  const activeTabId = tabs.length > 0 ? tabs[Math.max(removedTabIndex - 1, 0)].id : null;
  renderTabsView();
  if (activeTabId !== null) {
    switchTabController(activeTabId);
  } else {
    $('.tab-content').empty();
  }
}


function switchTabController(tabId) {
  $('.tab').removeClass('active');
  $(`.tab[data-id="${tabId}"]`).addClass('active');
  const tab = tabs.find(tab => tab.id === tabId);
  renderTabContentView(tab.url);
}

// Event listeners
$(document).ready(function() {

  renderTabsView()
  $('#add-tab').on('click', addTabController);


  $('.tab-container').on('click', '.close-btn', function() {
    const tabId = $(this).parent().data('id');
    removeTabController(tabId);
  });

  
  $('.tab-container').on('click', '.tab', function() {
    const tabId = $(this).data('id');
    switchTabController(tabId);
  });

  
  $('.tab-container').on('keyup', '.tab input', function(e) {
    if (e.keyCode === 13) {
      const tabId = $(this).parent().data('id');
      const url = $(this).val();
      updateTabUrl(tabId, url);
      switchTabController(tabId);
    }
  });
});
