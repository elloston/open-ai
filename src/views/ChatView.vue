<template>
  <div>
    <div class="container px-5">
      <div class="model-block">
        <p class="model-title">ChatGPT</p>

        <div id="gptChatResult" class="model-result chat-result">
          <div v-for="(item, index) in gptChat" :key="index">
           <div class="flex justify-end">
            <p class="gpt-question " v-html="item.question"></p>
           </div>

           <div class="flex justify-start">
            <p class="gpt-response"  v-html="item.answer"></p>
           </div>
          </div>
        </div>

        <form @submit.prevent="createChatCompletion()">
          <div>
            <textarea @change="saveMessage('gptMessage', gptMessage)" class="textarea-base-outline" required rows="4" v-model="gptMessage"></textarea>

            <p class="content-length-description">{{ gptMessage.length }}</p>
          </div>

          <div>
            <button class="send-model-btn" type="submit">Send</button>
          </div>
        </form>
      </div>

      <div class="line"></div>


    <div class="model-block">
      <form @submit.prevent="createImage()">
        <div>
          <p class="model-title">DALL-E</p>

          <textarea @change="saveMessage('dalleMessage', dalleMessage)" class="textarea-base-outline" required rows="4" v-model="dalleMessage"></textarea>

          <p class="content-length-description">{{ dalleMessage.length }}</p>
        </div>

        <div>
          <button class="send-model-btn" type="submit">Generate</button>
        </div>
      </form>

      <div class="model-result grid grid-cols-6">
        <a v-for="(imgUrl, index) in generatedImages" :key="index" :href="imgUrl" target="_blank">
          <img class="dalle-generated-img"  :src="imgUrl" />
        </a>
      </div>
    </div>

    
    </div>
  </div>
</template>

<script>
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: localStorage.getItem('apiKey'),
});
const openai = new OpenAIApi(configuration);

export default {
  name: "HomeView",
  data() {
    return {
      gptChatResult: null,
      gptMessage: "",
      dalleMessage: "",

      gptChat: [],
      generatedImages: [],
      apiKey: ''
    };
  },
  methods: {
    saveMessage(key, value) {
      localStorage.setItem(key, value)
    },
    async createChatCompletion() {
      try {
        this.$store.commit('LOADING', true)

        let data = {
          question: this.gptMessage,
          answer: "..."
        }
        this.gptChat.push(data);


        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: this.gptMessage,
            },
          ],
        });
        console.log(completion);
        let answer = completion.data.choices[0].message.content

        data = this.gptChat.pop()
        data.answer = answer
        this.gptChat.push(data);



        localStorage.setItem('gptChat', JSON.stringify(this.gptChat))

        this.$store.commit('LOADING', false)
      } catch (e) {
        this.$store.commit('LOADING', false)
        console.error(e)
      }
    },
    async createImage() {
      try {
        this.$store.commit('LOADING', true)

        let response = await openai.createImage({
          prompt: this.dalleMessage,
          n: 2,
          size: "1024x1024",
        });
        console.log(response)

        for (const imageData of response.data.data) {
          console.log(imageData)
          this.generatedImages.unshift(imageData.url);
        }
        
        localStorage.setItem('generatedImages', JSON.stringify(this.generatedImages))
        this.generatedImages = JSON.parse(localStorage.getItem('generatedImages'))

        this.$store.commit('LOADING', false)
      } catch (e) {
        this.$store.commit('LOADING', false)
        console.error(e)
      }
    },
  },
  async mounted() {
    this.apiKey = localStorage.getItem('apiKey')

    let generatedImages = localStorage.getItem('generatedImages');
    if (generatedImages) this.generatedImages = JSON.parse(generatedImages)

    let gptChat = localStorage.getItem('gptChat');
    if (gptChat) this.gptChat = JSON.parse(gptChat)


    let dalleMessage = localStorage.getItem('dalleMessage');
    if (dalleMessage) this.dalleMessage = dalleMessage

    let gptMessage = localStorage.getItem('gptMessage');
    if (gptMessage) this.gptMessage = gptMessage

    var container = this.$el.querySelector("#gptChatResult");
    container.scrollTop = container.scrollHeight;
  },
};
</script>

<style lang="scss">
.textarea-base-outline {
  background-color: unset;

  border: 2px solid;
  border-color: rgba($white, 0.1);

  resize: none;

  border-radius: $radius;

  width: 100%;


  padding: 20px 30px;

  color: rgba($white, 0.7);
  font-weight: 300;
  font-size: 18px;
}
.textarea-base-outline:focus {
  border-color: rgba($white, 0.3);
  outline: none;
}

.gpt-response {
  width: 60vw;
  text-align: start;
  font-size: 16px;
  font-weight: 300;
  color: rgba($white, 0.7);

  margin-bottom: 15px;

  padding: 20px 30px;
  border: 2px solid;
  border-radius: $radius;
  border-color: rgba($accent, 0.1);
  background-color: rgba($accent, 0.02);
}

.gpt-question {
  width: 60vw;

  text-align: start;
  font-size: 16px;
  font-weight: 300;
  color: rgba($white, 0.6);

  margin-bottom: 15px;

  padding: 20px 30px;
  border: 2px solid;
  border-radius: $radius;
  border-color: rgba($white, 0.1);
  background-color: rgba($white, 0.02);
}

.chat-result {

  overflow-y: scroll;

  border-left: 2px solid;
  border-right: 2px solid;
  // border-radius: $radius;
  border-color: rgba($white, 0.1);

  margin-top: 5vh;
  margin-bottom: 2vh;
  padding: 15px
}

.model-block {
  margin-bottom: 10vh;
}
.model-result {
  padding-top: 5vh;
}
.model-title {
  font-weight: 700;
  font-size: 20px;
  color: rgba($white, 0.3);
  text-align: start;

  padding-top: 10px;
  padding-bottom: 10px;
}

.send-model-btn {
  border: 1px solid;
  border-color: rgba($white, 0.1);
  border-radius: $radius;

  padding: 7px 30px;

  margin-top: 10px;

  font-weight: 400;
  font-size: 16px;
  color: rgba($white, 0.7);

}
.send-model-btn:focus {
  outline: none;
  border-color: rgba($white, 0.5);
  background-color: rgba($white, 0.05);
}

.content-length-description {
  font-weight: 700;
  font-size: 14px;
  color: rgba($white, 0.3);

  text-align: start;
  margin-left: 30px;
}

.dalle-generated-img {
  margin: 5px;
}



.line {
  height: 1px;
  width: 100%;
  background-color: rgba($white, 0.1);
}
</style>