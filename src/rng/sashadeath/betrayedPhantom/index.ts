import { sampleSize, sample } from 'lodash/fp';
import { betrayedPhantom as attribution } from 'rng/attributions';
import { formatAbilities, rollAbilities } from 'rng/shared/abilities';
import { formatBody } from 'rng/shared/bodies';
import { formatClass } from 'rng/shared/class';
import { formatHabit } from 'rng/shared/habits';
import { formatTrait } from 'rng/shared/traits';
import { titledEntry, formatTitledEntry } from 'rng/shared/entries';
import {
  formatEquipment,
  hasScroll,
  rollArmor,
  rollFoodAndWater,
  rollStandardEquipment,
  rollWeapon,
} from '../../shared/equipment';
import { rollHp, formatHp } from 'rng/shared/hp';
import { formatName } from 'rng/shared/names';
import { rollOmens, formatOmens } from 'rng/shared/omens';
import tables from 'rng/tables';
import { Character } from 'types/character';

export const betrayedPhantom = (): Character => {
  const abilities = rollAbilities(0, 0, 2, -2);
  const hp = rollHp(1, 6, abilities.toughness.score);
  const omens = rollOmens(1, 4);

  const generalEquipment = rollStandardEquipment();
  const weapon = rollWeapon(6);
  const armor = rollArmor(2, hasScroll(generalEquipment));
  // no silver
  const foodAndWater = rollFoodAndWater();
  const equipment = [foodAndWater, weapon, armor, ...generalEquipment];

  const incorporeal = titledEntry(attribution, 'incorporeal');
  const whoAndWhat = [
    'cannibal',
    'murderer',
    'liar',
    'adulterer',
    'leader',
    'kinslayer'
  ].map((x) => titledEntry(attribution, x));
  const phantomItems = [
    'keepsakeCoin',
    'deathmask',
    'prayerBook',
    'fingerBone',
    'tragicLetter',
    'glassEye',
  ].map((x) => titledEntry(attribution, x));

  return {
    tags: ['betrayedPhantom'],
    smalls: [
      formatName(sample(tables.names)!),
      formatClass('sashadeath.betrayedPhantom'),
      formatHp(hp),
      formatOmens(omens, 4),
    ],
    bigs: [
      {
        component: {
          id: 'introduction',
        },
        header: { id: 'character.stats.titles.introduction', values: {} },
        content: [
          {
            tags: ['betrayedPhantom', 'sashadeath', 'blurb'],
            title: {
              id: 'content.sashadeath.betrayedPhantom.blurb',
              values: {},
            },
            description: {
              id: 'content.sashadeath.betrayedPhantom.blurb',
              values: {},
            },
          },
          ...sampleSize(2, tables.traits).map((trait) => formatTrait(trait)),
          formatBody(sample(tables.bodies)!),
          formatHabit(sample(tables.habits)!),
        ],
      },
      formatTitledEntry(sample(whoAndWhat)!),
      formatTitledEntry(incorporeal),
      formatTitledEntry(sample(phantomItems)!),
      formatAbilities(abilities),
      {
        component: { id: 'equipmentList' },
        header: { id: 'character.stats.titles.equipment', values: {} },
        content: equipment
          .filter((item) => item.id !== '_blank')
          .map((item) =>
            formatEquipment(item, {
              presence: abilities.presence.score,
              money: { min: 0, max: 0 },
            })
          ),
      },
    ],
  };
};