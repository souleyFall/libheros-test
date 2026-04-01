<script setup lang="ts">
import { ref, onMounted, defineEmits, nextTick } from 'vue';
import { listAPI } from '../services/api';

interface List {
  id: string;
  title: string;
}

const props = defineProps({
  selectedListId: String,
});

const emit = defineEmits<{
  selectList: [id: string];
  listDeleted: [];
  'update:collapsed': [collapsed: boolean];
}>();

const lists = ref<List[]>([]);
const newListName = ref('');
const loading = ref(false);
const deleteConfirm = ref<string | null>(null);
const isCollapsed = ref(false);
const listInput = ref<HTMLInputElement | null>(null);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('update:collapsed', isCollapsed.value);
};

const fetchLists = async () => {
  try {
    const response = await listAPI.getAll();
    lists.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des listes', error);
  }
};

const onClickCreate = () => {
  if (isCollapsed.value) {
    isCollapsed.value = false;
    emit('update:collapsed', false);
    nextTick(() => {
      listInput.value?.focus();
    });
  } else {
    handleCreateList();
  }
};

const handleCreateList = async () => {
  if (!newListName.value.trim()) {
    alert('Veuillez entrer un nom pour la liste');
    return;
  }

  // Vérifier que la liste n'existe pas déjà
  if (lists.value.some((list) => list.title === newListName.value)) {
    alert('Une liste avec ce nom existe déjà');
    return;
  }

  loading.value = true;
  try {
    await listAPI.create({ title: newListName.value });
    newListName.value = '';
    await fetchLists();
  } catch (error) {
    console.error('Erreur lors de la création de la liste', error);
    alert('Erreur lors de la création de la liste');
  } finally {
    loading.value = false;
  }
};

const handleDeleteList = async (id: string) => {
  try {
    await listAPI.delete(id);
    await fetchLists();
    emit('listDeleted');
  } catch (error) {
    console.error('Erreur lors de la suppression de la liste', error);
    alert('Erreur lors de la suppression de la liste');
  } finally {
    deleteConfirm.value = null;
  }
};

onMounted(fetchLists);
</script>

<template>
  <aside class="left-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <h2 v-if="!isCollapsed">LibHeros</h2>
      <button class="toggle-btn" @click="toggleSidebar">
        <svg v-if="!isCollapsed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/></svg>
      </button>
    </div>

    <div class="create-list">
      <input
        v-if="!isCollapsed"
        ref="listInput"
        v-model="newListName"
        type="text"
        placeholder="Nouvelle liste..."
        @keyup.enter="handleCreateList"
      />
      <button @click="onClickCreate" :disabled="loading">
        <span v-if="loading">...</span>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
      </button>
    </div>

    <div class="lists">
      <div
        v-for="list in lists"
        :key="list.id"
        class="list-item"
        :class="{ active: selectedListId === list.id }"
        :title="isCollapsed ? list.title : ''"
      >
        <div class="list-content" @click="emit('selectList', list.id)">
           <svg v-if="isCollapsed" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          <span v-if="!isCollapsed" class="list-name">{{ list.title }}</span>
        </div>
        <button
          v-if="!isCollapsed"
          class="delete-btn"
          @click="deleteConfirm = list.id"
          title="Supprimer cette liste"
        >
          ✕
        </button>

        <!-- Modal de confirmation -->
        <div v-if="deleteConfirm === list.id" class="confirm-modal">
          <div class="confirm-content">
            <p>Êtes-vous sûr? Toutes les tâches associées seront également supprimées.</p>
            <div class="confirm-buttons">
              <button class="btn-danger" @click="handleDeleteList(list.id)">
                Confirmer
              </button>
              <button class="btn-cancel" @click="deleteConfirm = null">
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="lists.length === 0 && !isCollapsed" class="empty-state">
        Aucune liste. Créez-en une!
      </div>
    </div>
  </aside>
</template>

<style scoped>
.left-sidebar {
  width: 280px;
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  border-right: 1px solid #1a202c;
  overflow-y: auto;
  height: 100vh;
  transition: width 0.3s ease;
  position: relative;
}

.left-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #4a5568;
  padding-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-sidebar.collapsed .sidebar-header {
  padding: 0 1rem;
  justify-content: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #667eea;
  white-space: nowrap;
}

.toggle-btn {
  background: #4a5568;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background 0.2s;
  padding: 0;
}

.toggle-btn:hover {
  background: #667eea;
}

.create-list {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.left-sidebar.collapsed .create-list {
  justify-content: center;
}

.create-list input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #4a5568;
  border-radius: 4px;
  background: #374151;
  color: white;
  font-size: 0.9rem;
}

.create-list input::placeholder {
  color: #a0aec0;
}

.create-list input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.create-list button {
  padding: 0.5rem;
  width: 36px;
  height: 36px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  transition: background 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-list button:hover:not(:disabled) {
  background: #764ba2;
}

.create-list button:disabled {
  opacity: 0.6;
}

.lists {
  flex: 1;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0.5rem;
  background: #374151;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;
  gap: 0.5rem;
  white-space: nowrap;
}

.left-sidebar.collapsed .list-item {
  justify-content: center;
}

.list-item:hover {
  background: #4a5568;
}

.list-item.active {
  background: #667eea;
  font-weight: 600;
}

.list-content {
  flex: 1;
  cursor: pointer;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.left-sidebar.collapsed .list-content {
  flex: 0;
}

.list-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-initial {
  font-size: 1.2rem;
  font-weight: bold;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn {
  background: transparent;
  color: #cbd5e0;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #f56565;
}

.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #333;
  max-width: 400px;
}

.confirm-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.confirm-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-danger:hover {
  background: #c53030;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #cbd5e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #a0aec0;
}

.empty-state {
  padding: 2rem 1rem;
  text-align: center;
  color: #a0aec0;
  font-size: 0.9rem;
}
</style>
