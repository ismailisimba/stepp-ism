<template>
    <div class="container">
      <form @submit.prevent="submit">
        <!-- Role Filter -->
        <div class="dropdown">
          <label for="roleFilter">Filter by Role:</label>
          <select id="roleFilter" v-model="roleFilter">
            <option value="all">All</option>
            <option value="applicant">Applicant</option>
            <option value="donor">Donor</option>
          </select>
        </div>
  
        <!-- Users List -->
        <div v-for="(user, index) in filteredUsers" :key="user.email">
          <button
            type="button"
            class="collapsible"
            @click="toggleSection(user.email)"
          >
            {{ user.email }} ({{ user.userType }})
          </button>
          <div class="content" v-show="openSections[user.email]">
            <div v-for="actionType in actionTypes" :key="actionType">
              <h4>{{ actionType }}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="section in getSections(actionType)"
                    :key="section"
                  >
                    <td>{{ section }}</td>
                    <td>
                      <div
                        v-for="action in getActions(section, actionType, user)"
                        :key="action"
                      >
                        <label>
                          <input
                            type="checkbox"
                            v-model="userPermissions[user.email][actionType][section][action]"
                          />
                          {{ action }}
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- Submit Button -->
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import axios from 'axios';
  
  // Data references
  const settings = ref(null);
  const users = ref(null);
  
  // Role filter
  const roleFilter = ref('all');
  
  // Action types
  const actionTypes = ['menuActions', 'tableActions'];
  
  // Open sections for collapsible functionality
  const openSections = reactive({});
  
  // User permissions
  const userPermissions = reactive({});
  
  // Load data on component mount
  onMounted(async () => {
    try {
      // Fetch settings and users data from the provided endpoints
      const [settingsResponse, usersResponse] = await Promise.all([
        axios.get('https://grantman-czivjdfhnq-ez.a.run.app/libraries/program_data_schema.json'),
        axios.get('https://grantman-czivjdfhnq-ez.a.run.app/getallusernames'),
      ]);
  
      settings.value = settingsResponse.data;
      users.value = usersResponse.data;
  
      // Initialize user permissions
      initializeUserPermissions();
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again later.');
    }
  });
  
  // Initialize user permissions
  function initializeUserPermissions() {
    users.value.forEach(user => {
      // Parse current permissions
      const currentPermissions = user.currentPermissions
        ? JSON.parse(user.currentPermissions)
        : {};
  
      // Initialize permissions for user
      userPermissions[user.email] = {};
  
      actionTypes.forEach(actionType => {
        userPermissions[user.email][actionType] = {};
  
        // Get sections for the action type
        const sections = getSections(actionType);
  
        sections.forEach(section => {
          userPermissions[user.email][actionType][section] = {};
  
          // Get actions for the user's role
          const actions =
            settings.value[actionType][section][user.userType] || [];
  
          actions.forEach(action => {
            const actionOnKey = `${action}_on`;
            const actionOffKey = `${action}_off`;
            const userActionPermissions =
              (currentPermissions[section] &&
                currentPermissions[section][actionType]) ||
              [];
  
            // Check if the action is enabled or disabled
            const isEnabled = userActionPermissions.includes(actionOnKey);
  
            userPermissions[user.email][actionType][section][action] = isEnabled;
          });
        });
      });
    });
  }
  
  // Computed property for filtered users
  const filteredUsers = computed(() => {
    if (!users.value) return [];
    if (roleFilter.value === 'all') {
      return users.value;
    }
    return users.value.filter(user => user.userType === roleFilter.value);
  });
  
  // Toggle collapsible sections
  function toggleSection(email) {
    openSections[email] = !openSections[email];
  }
  
  // Get sections for the action type
  function getSections(actionType) {
    if (!settings.value || !settings.value[actionType]) return [];
    return Object.keys(settings.value[actionType]);
  }
  
  // Get actions for a section, action type, and user
  function getActions(section, actionType, user) {
    if (
      !settings.value ||
      !settings.value[actionType] ||
      !settings.value[actionType][section]
    ) {
      return [];
    }
    return settings.value[actionType][section][user.userType] || [];
  }
  
  // Handle form submission
  function submit() {
    // Prepare form data to send
    const formData = new FormData();
  
    users.value.forEach(user => {
      actionTypes.forEach(actionType => {
        const sections = Object.keys(userPermissions[user.email][actionType] || {});
  
        sections.forEach(section => {
          const actions = userPermissions[user.email][actionType][section] || {};
  
          Object.entries(actions).forEach(([action, isEnabled]) => {
            const key = `${user.email}_${section}_${actionType}_${action}`;
            if (isEnabled) {
              formData.append(key, 'on');
            } else {
              formData.append(`${key}_off`, 'off');
            }
          });
        });
      });
    });
  
    // Send data to the server
    axios
      .post('/update-user-settings', formData)
      .then(response => {
        alert('Permissions updated successfully.');
      })
      .catch(error => {
        console.error('Error updating permissions:', error);
        alert('Error updating permissions.');
      });
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px; /* Added padding */
    border: 1px solid #ccc; /* Added border */
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Added box shadow */
    background-color: #fff; /* Added background color */
  }
  
  form {
    padding: 20px; /* Added padding */
  }
  
  .dropdown {
    margin-bottom: 20px;
  }
  
  .dropdown label {
    font-weight: bold;
  }
  
  .dropdown select {
    margin-left: 10px;
    padding: 5px;
  }
  
  .collapsible {
    cursor: pointer;
    padding: 10px;
    margin-top: 10px; /* Added margin-top */
    border: 1px solid #ccc; /* Added border */
    text-align: left;
    outline: none;
    font-size: 16px;
    background-color: #f9f9f9;
    width: 100%;
  }
  
  .active,
  .collapsible:hover {
    background-color: #e0e0e0;
  }
  
  .content {
    padding: 10px 18px;
    margin-bottom: 20px; /* Added margin-bottom */
    overflow: hidden;
    background-color: #f9f9f9;
    border: 1px solid #ccc; /* Added border */
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  table,
  th,
  td {
    border: 1px solid #ccc;
  }
  
  th,
  td {
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  button[type="submit"] {
    padding: 10px 20px;
    background-color: #4CAF50; /* Green */
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  
  button[type="submit"]:hover {
    background-color: #45a049;
  }
  
  label {
    margin-right: 10px;
  }
  
  input[type="checkbox"] {
    margin-right: 5px;
  }
  </style>
  