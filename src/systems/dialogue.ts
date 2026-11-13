import * as Phaser from 'phaser';
import { openOverlay } from './overlay';
import { playerState } from './state';

// Branching conversations with NPCs, shown in the Talk overlay (scenes/TalkScene.ts) over a close-up of whoever you
// talk to. A conversation is a graph of nodes: each node is one thing the NPC says plus the answers you can pick, and
// an answer leads to another node or ends the talk. All text is localised under talk.<npc>:
//   talk.<npc>.name                the NPC's name, shown over the close-up
//   talk.<npc>.<node>.line         what they say; "a|b|c" picks one at random, {money} is your wallet
//   talk.<npc>.<node>.<choice id>  what you answer
// To add a talking NPC: art in art/scripts/npc_art.py (street sprite npc/<npc>.png, close-up talk/<npc>.png), an
// entry here, a marker_<npc> tile on the street, and the text.

type State = typeof playerState;

export interface Choice {
  id: string;
  next?: string; // node it leads to; without one the conversation ends after this answer
  when?: (s: State) => boolean; // only offered when this holds
  price?: number; // cents; shown with the answer, paid when picked. Short of money: goes to the `broke` node instead
  gives?: string; // inventory item you get
  takes?: string; // inventory item you hand over (only offer the choice `when` you have it)
  sets?: string; // flag remembered in playerState.flags (e.g. what you already know or did)
}

export interface DialogueNode {
  // Without choices the NPC has the last word, and the only answer is talk.leave
  choices?: Choice[];
}

export interface Conversation {
  start: (s: State) => string;
  broke: string; // node for answers you can't pay for
  nodes: Record<string, DialogueNode>;
}

const DRUGS = [
  { id: 'weed', price: 1000 },
  { id: 'poppers', price: 800 },
  { id: 'ketamine', price: 2500 },
  { id: 'heroin', price: 4000 },
  { id: 'cocaine', price: 7000 },
];

const has = (item: string) => (s: State) => s.inventory.includes(item);
const flag = (name: string) => (s: State) => s.flags.includes(name);
const not = (test: (s: State) => boolean) => (s: State) => !test(s);

// The guy in the doorway on Neukölln's main street. Sells to anyone with cash, wants nothing to do with Pfand.
const dealer: Conversation = {
  start: (s) => (s.flags.includes('dealer.customer') ? 'regular' : s.flags.includes('dealer.met') ? 'again' : 'hello'),
  broke: 'broke',
  nodes: {
    hello: {
      choices: [
        { id: 'what', next: 'menu', sets: 'dealer.met' },
        { id: 'who', next: 'who', sets: 'dealer.met' },
        { id: 'no', next: 'bye' },
      ],
    },
    again: { choices: [{ id: 'what', next: 'menu' }, { id: 'who', next: 'who' }, { id: 'no', next: 'bye' }] },
    regular: { choices: [{ id: 'what', next: 'menu' }, { id: 'no', next: 'bye' }] },
    who: {
      choices: [
        { id: 'cop', next: 'cop', when: not(flag('dealer.asked_cop')), sets: 'dealer.asked_cop' },
        { id: 'what', next: 'menu' },
        { id: 'no', next: 'bye' },
      ],
    },
    cop: { choices: [{ id: 'what', next: 'menu' }, { id: 'no', next: 'bye' }] },
    menu: {
      choices: [
        ...DRUGS.map(({ id }) => ({ id, next: id })),
        { id: 'bottle', next: 'bottle', when: has('bottle') },
        { id: 'nothing', next: 'bye' },
      ],
    },
    // One node per drug: what he says about it, buy it or go back to the list
    ...Object.fromEntries(
      DRUGS.map(({ id, price }) => [
        id,
        {
          choices: [
            { id: 'buy', price, gives: id, sets: 'dealer.customer', next: 'sold' },
            { id: 'back', next: 'menu' },
          ],
        },
      ]),
    ),
    bottle: { choices: [{ id: 'back', next: 'menu' }, { id: 'no', next: 'bye' }] },
    sold: { choices: [{ id: 'more', next: 'menu' }, { id: 'no', next: 'bye' }] },
    broke: {
      choices: [
        { id: 'discount', next: 'discount', when: not(flag('dealer.asked_discount')), sets: 'dealer.asked_discount' },
        { id: 'back', next: 'menu' },
        { id: 'no', next: 'bye' },
      ],
    },
    discount: { choices: [{ id: 'back', next: 'menu' }, { id: 'no', next: 'bye' }] },
    bye: {},
  },
};

export const CONVERSATIONS: Record<string, Conversation> = { dealer };

// Items you can come away with from a conversation; their HUD icons are pickups/pickup_<item>.png
export const TALK_ITEMS = DRUGS.map((d) => d.id);

export function preloadTalkArt(scene: Phaser.Scene) {
  for (const npc of Object.keys(CONVERSATIONS)) {
    scene.load.spritesheet(`npc_${npc}`, `npc/${npc}.png`, { frameWidth: 96, frameHeight: 96 });
    scene.load.image(`talk_${npc}`, `talk/${npc}.png`);
  }
  for (const item of TALK_ITEMS) scene.load.image(`pickup_${item}`, `pickups/pickup_${item}.png`);
}

// Opens the conversation with `npc` over the calling scene, which pauses until you walk away
export function openTalk(scene: Phaser.Scene, npc: string) {
  openOverlay(scene, 'Talk', { npc });
}
