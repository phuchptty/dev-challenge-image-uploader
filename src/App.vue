<!-- @format -->

<template>
	<div class="relative bg-gray-250 h-screen w-screen overflow-hidden select-none">
		<transition name="component-fade" mode="out-in">
			<div class="container absolute top-1/2 left-1/2 justify-items-center bg-white py-9" v-if="step == 1">
				<div class="font-medium text-gray-550 text-center">
					<p class="text-lg">Upload your image</p>
					<p class="descText mt-4">File should be Jpeg, Png,...</p>

					<div
						@dragover="formDragOver"
						@dragleave="formDragLeave"
						@drop="formDrop"
						class="mx-auto dadImgContainer text-center mt-8 bg-gray-150 border-dashed border-2 border-blue-120 rounded-xl"
					>
						<div class="dadImg mx-auto mt-9" :style="{ backgroundImage: 'url(' + DADImage + ')' }"></div>

						<p class="text-xs mt-11">Drag & Drop your image here</p>
					</div>

					<p class="text-sm mt-5">Or</p>
				</div>

				<div
					@click.stop="uploadFileBtn"
					class="btnChooseFile cursor-pointer w-28 h-8 px-4 py-2 bg-blue-550 hover:bg-blue-600 mx-auto mt-5 rounded-lg text-white font-medium text-center text-xs"
				>
					Choose a file
				</div>
				<input type="file" accept="image/*" id="uploadFile" hidden @change="inputFileChange" />
			</div>
		</transition>

		<transition name="component-fade" mode="out-in">
			<div class="container absolute top-1/2 left-1/2 justify-items-center bg-white px-8 py-9" v-if="step == 2">
				<p class="text-gray-550 text-lg font-medium">Uploading...</p>

				<div class="proceesBar bg-gray-process w-full mt-8 rounded-lg">
					<div :style="{ width: `${percent}%` }" class="processcCursor bg-blue-550 h-full rounded-lg"></div>
				</div>
			</div>
		</transition>

		<transition name="component-fade" mode="out-in">
			<div class="container absolute top-1/2 left-1/2 justify-items-center bg-white px-8 py-9" v-if="step == 3">
				<div class="mx-auto text-gray-550 font-medium">
					<center>
						<i class="mdi mdi-check-circle text-5xl text-green-500"></i>
					</center>

					<p class="text-center mt-3 text-lg">Uploaded Successfully!</p>

					<img :src="previewUrl" alt="Result Image" class="mx-auto w-full h-auto mt-6 rounded-xl" />

					<div class="linkForm relative">
						<input
							v-model="downloadURL"
							disabled
							class="linkFormInput w-full h-10 mt-6 px-2 py-3 border-solid box-border border-gray-input-border bg-gray-input rounded-lg text-black text-sm"
						/>
						<button @click.stop="copyLink()" class="buttonCopy absolute z-10 bg-blue-550 hover:bg-blue-600 px-5 py-2 rounded-lg text-white translate-x-1 text-xs">Copy Link</button>
					</div>
				</div>
			</div>
		</transition>

		<div class="footer w-full bottom-6 fixed text-center font-medium text-sm">
			<p>Created by <span class="font-bold underline">phuchptty</span> - devChallenges.io</p>
		</div>
	</div>
</template>

<script>
import DADImage from './assets/image.svg';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default {
	name: 'App',
	setup() {
		return {
			DADImage,
		};
	},
	data: () => ({
		step: 1,
		file: null,
		percent: 0,
		downloadURL: '',
		previewUrl: '',
	}),
	methods: {
		formDragOver(event) {
			event.preventDefault();
			// console.log('Vao');

			if (event.currentTarget.classList.contains('bg-gray-150')) {
				event.currentTarget.classList.remove('bg-gray-150');
				event.currentTarget.classList.add('bg-gray-300');
			}
		},
		formDragLeave(event) {
			event.preventDefault();
			// console.log('Ra');

			if (event.currentTarget.classList.contains('bg-gray-300')) {
				event.currentTarget.classList.remove('bg-gray-300');
				event.currentTarget.classList.add('bg-gray-150');
			}
		},
		formDrop(event) {
			event.preventDefault();

			const file = event.dataTransfer.files;

			if (file[0].size > 6 * 1024 * 1024) {
				this.$swal({
					icon: 'error',
					title: 'Error',
					text: 'Image Must Not Larger Than 6 MB',
				});
				return false;
			}

			this.file = file[0];
			this.step = 2;
			this.upload();
		},
		uploadFileBtn() {
			document.querySelector('#uploadFile').click();
		},
		inputFileChange(event) {
			const file = event.target.files;

			if (file[0].size > 6 * 1024 * 1024) {
				this.$swal({
					icon: 'error',
					title: 'Error',
					text: 'Image Must Not Larger Than 6 MB',
				});
				return false;
			}

			this.file = file[0];
			this.step = 2;
			setTimeout(() => {
				this.upload();
			}, 300);
		},
		upload() {
			const storage = getStorage();
			const storageRef = ref(storage, `challenge1/images/${uuidv4()}`);

			const metadata = {
				contentType: this.file.type,
				size: this.file.size,
			};

			const uploadTask = uploadBytesResumable(storageRef, this.file, metadata);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					this.percent = progress;
					// console.log('Upload is ' + progress + '% done');
				},
				(error) => {
					this.$swal({
						icon: 'error',
						title: 'Error',
						text: error,
					});
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						// console.log('File available at', downloadURL);
						this.downloadURL = downloadURL;
						this.step = 3;
					});

					const blobUrl = URL.createObjectURL(this.file);
					this.previewUrl = blobUrl;
				}
			);
		},
		copyLink() {
			const copyText = document.querySelector('.linkFormInput');

			copyText.select();
			copyText.setSelectionRange(0, 99999);

			navigator.clipboard.writeText(copyText.value);

			this.$swal({
				icon: 'success',
				title: 'Copy link success',
			});
		},
	},
};
</script>

<style lang="scss" scoped>
p {
	font-family: 'Poppins', sans-serif;
}

.container {
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	width: 402px;
	// height: 469px;
	box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
	border-radius: 12px;
}

.buttonCopy {
	height: 36px;
	top: 26px;
	right: 2px;
	font-family: 'Poppins', sans-serif;
}

.descText {
	font-size: 0.7rem;
	line-height: 1rem;
}

.dadImgContainer {
	width: 338px;
	height: 218.9px;
}

.dadImg {
	background-repeat: no-repeat;
	background-size: cover;
	width: 114.13px;
	height: 88.24px;
}

.proceesBar {
	height: 6px;
}

.linkFormInput {
	border-width: 1px;
}

.footer {
	font-family: 'Montserrat', sans-serif;
	color: #a9a9a9;
}
</style>

<style lang="scss">
.component-fade-enter-active,
.component-fade-leave-active {
	transition: left 1s ease-in-out;
	-webkit-transition: left 1s ease-in-out;
}

.component-fade-enter-from,
.component-fade-leave-to {
	opacity: 0;
}
</style>
