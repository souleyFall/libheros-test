<script setup lang="ts">
import { ref } from 'vue';
import type { InstanceType } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../stores/auth';
import LeftSidebar from '../components/LeftSidebar.vue';
import MainContent from '../components/MainContent.vue';
import RightSidebar from '../components/RightSidebar.vue';

interface Task {
  id: string;
  shortDescription: string;
  longDescription?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

const router = useRouter();
const { clearToken, user } = useAuth();

const selectedListId = ref<string | null>(null);
const selectedTask = ref<Task | null>(null);
const isSidebarCollapsed = ref(false);
const mainContent = ref<InstanceType<typeof MainContent> | null>(null);

const handleLogout = () => {
  clearToken();
  router.push('/login');
};

const handleSelectList = (listId: string) => {
  selectedListId.value = listId;
  selectedTask.value = null; // Fermer la right sidebar
};

const handleSelectTask = (task: Task) => {
  selectedTask.value = task;
};

const handleListDeleted = () => {
  selectedListId.value = null;
  selectedTask.value = null;
};

const handleTaskDeleted = () => {
  selectedTask.value = null;
  mainContent.value?.fetchTasks();
};

const onSidebarCollapsed = (collapsed: boolean) => {
  isSidebarCollapsed.value = collapsed;
};
</script>

<template>
  <div class="main-layout">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <h1>LibHeros</h1>
      </div>
      <div class="header-right">
        <span v-if="user" class="user-info">{{ user.email }}</span>
        <button class="logout-btn" @click="handleLogout">Déconnexion</button>
      </div>
    </header>

    <!-- Contenu principal -->
    <div class="layout-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <LeftSidebar
        :selected-list-id="selectedListId"
        @select-list="handleSelectList"
        @list-deleted="handleListDeleted"
        @update:collapsed="onSidebarCollapsed"
      />
      <MainContent
        ref="mainContent"
        :selected-list-id="selectedListId"
        @select-task="handleSelectTask"
        @task-updated="() => {}"
      />
      <RightSidebar
        :task="selectedTask"
        @close="selectedTask = null"
        @task-deleted="handleTaskDeleted"
      />
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7fafc;
}

.header {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #667eea;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  font-size: 0.95rem;
  color: #cbd5e0;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #764ba2;
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  transition: margin-left 0.3s ease;
}

.layout-container.sidebar-collapsed {
  
}
</style>
