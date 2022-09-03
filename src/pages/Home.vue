<template>
    <div class="wrap">
        <div class="container">
            <MainView />
            <SubView />
        </div>
    </div>
</template>

<script>
import MainView from '../components/MainView.vue';
import SubView from '../components/SubView.vue';

export default { components: { MainView, SubView } };
</script>

<style lang="scss" scoped>
@import '~/scss/main.scss';

.wrap {
    @include center;
    width: 100%;
    height: 100vh;
    font-size: 16px;

    .container {
        @include center-sb;
        width: 55%;
        height: 90%;
        max-width: 1920px;
        max-height: 1354px;
    }
}
</style>
