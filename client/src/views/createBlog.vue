<template>
  <div class="container p-5">
    <validation-observer ref="simpleRules">
      <b-form>
        <b-row>
          <b-col md="6">
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Title"
                rules="required"
              >
                <b-form-input
                  v-model="blog.title"
                  :state="errors.length > 0 ? false:null"
                  placeholder="Title"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="kategori"
                rules="required"
              >
                <b-form-input
                  v-model="blog.category"
                  :state="errors.length > 0 ? false:null"
                  type="text"
                  placeholder="kategori"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="İçerik"
                rules="required"
              >
                <quill-editor
                  id="bid-price-desc"
                  v-model="blog.content"
                  :options="snowOption"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <!-- submit button -->
          <b-col>
            <b-button
              variant="primary"
              type="submit"
              @click.prevent="validationForm"
            >
              Kaydet
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </div>

</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email } from '@validations'
import { quillEditor } from 'vue-quill-editor'
// eslint-disable-next-line
import 'quill/dist/quill.core.css'
// eslint-disable-next-line
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line
import 'quill/dist/quill.bubble.css'
import {
  BFormInput, BFormGroup, BForm, BRow, BCol, BButton,
} from 'bootstrap-vue'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BForm,
    BRow,
    BCol,
    BButton,
    quillEditor,
  },
  data() {
    return {
      blog: {
        title: '',
        content: '',
        category: '',
      },
      required,
      email,
      snowOption: {
        placeholder: 'içerik',
        locale: 'tr'
      },
    }
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then(success => {
        console.log(success)
        if (success) {
          this.$store.dispatch('createBlog', this.blog)
        }
      })
    },
  },
}
</script>
