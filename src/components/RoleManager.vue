<template>
  <div class="q-pa-md">
    <q-btn-dropdown
      split
      no-caps
      color="secondary"
      :label="activeRole"
    >
      <q-list
        dark
        bordered
        padding
        class="bg-primary">
        <q-item
          class="bg-primary"
          clickable
          v-close-popup
          v-for="role in roles"
          :key="role.arn">
          <q-item-section avatar>
            <q-avatar square color="secondary" text-color="white">{{role.name}}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label @click="setActiveRole({ arn: role.arn, name: role.name })">
              {{ role.arn }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
              <q-btn dense icon="edit" disable flat color="accent" @click="editRole(role)" v-close-popup/>
              <q-btn dense icon="delete" flat color="accent" @click="deleteRole(role)" v-close-popup/>
          </q-item-section>
        </q-item>

        <q-separator spaced="" inset="" dark/>

        <q-item>
          <q-item-section side>
            <q-btn label="Add Role" @click="manageRoles" color="secondary"/>
          </q-item-section>
        </q-item>
      </q-list>

      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Add Role</div>
          </q-card-section>

          <q-card-section class="q-pt-none bg-primary text-white">
            <q-form
              autofocus
              @submit="onSubmit"
              class="q-gutter-md text-white"
            >
              <q-input
                dark
                debounce="300"
                color="secondary"
                label-color="white"
                counter
                standout="bg-accent"
                clearable
                v-model="accountNumber"
                label="Account number"
                hint="The account number"
                class="text-white"
                value="">
                <template v-slot:append>
                  <q-icon name="info" color="primary" />
                </template>
              </q-input>
              <q-input
                dark
                debounce="300"
                color="secondary"
                label-color="white"
                counter
                standout="bg-secondary"
                clearable
                v-model="roleName"
                label="Role name"
                autogrow
                value=""
              >
                <template v-slot:append>
                  <q-icon name="input" color="primary" />
                </template>
              </q-input>
              <q-input
                dark
                debounce="300"
                color="secondary"
                label-color="white"
                counter
                standout="bg-accent"
                clearable
                v-model="roleNickname"
                label="Role nickname"
                value=""
              >
                <template v-slot:append>
                  <q-icon name="sms" color="primary" />
                </template>
              </q-input>
              <div>
                <q-btn label="Submit" type="submit" color="secondary"/>
                <q-btn label="Reset" type="reset" color="secondary" flat class="q-ml-sm"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Role } from 'src/store/roles/state'

@Component
export default class RoleManager extends Vue {
  prompt = false;
  accountNumber = '';
  roleName = '';
  roleNickname = '';

  get activeRole (): string {
    return this.$store.getters['roles/getActiveRole']
  }

  get roles (): Role[] {
    return this.$store.getters['roles/getRoles']
  }

  setActiveRole (role: Role): void {
    this.$store.dispatch('roles/updateActiveRoleAction', role)
    this.$store.dispatch('central/updateClusters', [])
  }

  deleteRole (role: Role): void {
    this.$store.dispatch('roles/deleteRoleAction', role)
  }

  editRole (role: Role): void {
    console.log('editing role')
  }

  manageRoles (): void {
    this.prompt = true
  }

  onSubmit (): void {
    const baseArn = 'arn:aws:iam::' + this.$data.accountNumber + ':role/' + this.$data.roleName
    this.$store.dispatch('roles/addRoleAction', {
      arn: baseArn,
      name: this.roleNickname
    })
    this.prompt = false
  }
}
</script>

<style lang="sass">
.menu-link
  color: white
  background: #232f3e
</style>
