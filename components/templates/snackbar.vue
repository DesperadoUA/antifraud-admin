<template>
	<v-snackbar :timeout="timeout" class="font-podkova-bold" color="deep-orange" status="true">
		<div class="text-center text-uppercase">
			{{ text }}
		</div>
	</v-snackbar>
</template>
<script>
export default {
	props: ['text', 'timeout']
}
</script>
