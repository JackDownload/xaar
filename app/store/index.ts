import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { Route } from 'vue-router';
import Vue from 'vue';
import { getContent } from '@/utils';

export interface State {
  pages: Page[];
  posts: Post[];
  recipes: Recipe[];
  blogcategories: Categories[];
  route?: Route;
}

// Initial State
export const appState = {
  pages: [],
  posts: [],
  recipes: [],
  blogcategories: [],
};

export const mutations: MutationTree<State> = {
  SET_PAGES: (state, payload: object): void => {
    Vue.set(state, 'pages', payload);
  },
  SET_POSTS: (state, payload: object): void => {
    Vue.set(state, 'posts', payload);
  },
  SET_RECIPES: (state, payload: object): void => {
    Vue.set(state, 'recipes', payload);
  },
  SET_BLOGCATEGORY: (state, payload: object): void => {
    Vue.set(state, 'blogcategories', payload);
  },
};

interface Actions<S, R> extends ActionTree<S, R> {
  GET_PAGES_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_POSTS_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_RECIPES_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_BLOGCATEGORY_LIST(context: ActionContext<S, R>): Promise<void | Error>; 
  nuxtServerInit(context: ActionContext<S, R>): void;
}

export const actions: Actions<State, State> = {
  async GET_POSTS_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/blog/', false, /\.json$/);
    const posts = await getContent({ context, prefix: 'blog' });
    commit('SET_POSTS', posts);
  },
  
  async GET_PAGES_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/pages/', false, /\.json$/);
    const pages = await getContent({
      context,
      prefix: 'pages',
    });
    commit('SET_PAGES', pages);
  },

  async SET_RECIPES_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/recipe/', false, /\.json$/);
    const recipes = await getContent({ context, prefix: 'recipe' });
    commit('SET_RECIPES', recipes);
  },

  async SET_BLOGCATEGORY_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/recipe/', false, /\.json$/);
    const blogcategories = await getContent({ context, prefix: 'categories' });
    commit('SET_BLOGCATEGORY', blogcategories);
  },

  async nuxtServerInit({ dispatch }): Promise<void> {
    await Promise.all([
      dispatch('GET_PAGES_LIST'),
      dispatch('GET_POSTS_LIST'),
      dispatch('GET_RECIPES_LIST'),
      dispatch('GET_BLOGCATEGORY_LIST')]);
  },
};

export const state = (): State => ({
  ...appState,
});

export const strict = false;
