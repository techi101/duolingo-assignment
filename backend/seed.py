"""
Seed script – wipes DB and re-populates with Spanish, English, and French courses.
Run: py seed.py  (with venv active, from the backend/ folder)
"""
from models import (
    engine, Base, User, Course, Unit, Lesson,
    Challenge, ChallengeOption, ChallengeProgress, UserProgress
)
from sqlalchemy.orm import sessionmaker
import datetime

# ── Recreate all tables ──────────────────────────────────────────────────────
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)
db = Session()

# ── Course ───────────────────────────────────────────────────────────────────
spanish = Course(title="Spanish", image_src="/es.svg")
english = Course(title="English", image_src="/en.svg")
french = Course(title="French", image_src="/fr.svg")
db.add_all([spanish, english, french])
db.flush()

# ── Units ────────────────────────────────────────────────────────────────────
unit1 = Unit(title="Unit 1", description="Learn the basics of Spanish", order=1, course_id=spanish.id)
en_unit1 = Unit(title="Unit 1", description="Learn the basics of English", order=1, course_id=english.id)
fr_unit1 = Unit(title="Unit 1", description="Learn the basics of French", order=1, course_id=french.id)
db.add_all([unit1, en_unit1, fr_unit1])
db.flush()

# ── Lessons ──────────────────────────────────────────────────────────────────
lesson1 = Lesson(title="Introductions", order=1, unit_id=unit1.id)
lesson2 = Lesson(title="Animals",       order=2, unit_id=unit1.id)

en_lesson1 = Lesson(title="Food",       order=1, unit_id=en_unit1.id)
en_lesson2 = Lesson(title="Animals",    order=2, unit_id=en_unit1.id)

fr_lesson1 = Lesson(title="Animals",    order=1, unit_id=fr_unit1.id)
fr_lesson2 = Lesson(title="Food",       order=2, unit_id=fr_unit1.id)

db.add_all([lesson1, lesson2, en_lesson1, en_lesson2, fr_lesson1, fr_lesson2])
db.flush()

# ── Helpers ──────────────────────────────────────────────────────────────────
def make_select(db, lesson_id, question, options, order):
    c = Challenge(lesson_id=lesson_id, type="SELECT", question=question, order=order)
    db.add(c); db.flush()
    for opt in options:
        if len(opt) == 3:
            text, correct, image_src = opt
        else:
            text, correct = opt
            image_src = None
        db.add(ChallengeOption(challenge_id=c.id, text=text, correct=correct, image_src=image_src))

def make_assist(db, lesson_id, question, options, order):
    c = Challenge(lesson_id=lesson_id, type="ASSIST", question=question, order=order)
    db.add(c); db.flush()
    for text, correct in options:
        db.add(ChallengeOption(challenge_id=c.id, text=text, correct=correct))

def make_type_answer(db, lesson_id, question, correct_answer, order):
    c = Challenge(lesson_id=lesson_id, type="TYPE_ANSWER", question=question, order=order)
    db.add(c); db.flush()
    db.add(ChallengeOption(challenge_id=c.id, text=correct_answer, correct=True))

def make_match_pairs(db, lesson_id, question, pairs, order):
    c = Challenge(lesson_id=lesson_id, type="MATCH_PAIRS", question=question, order=order)
    db.add(c); db.flush()
    for word, translation in pairs:
        db.add(ChallengeOption(challenge_id=c.id, text=f"{word}|||{translation}", correct=True))

def make_fill_in_blanks(db, lesson_id, question, options, order):
    c = Challenge(lesson_id=lesson_id, type="FILL_IN_BLANKS", question=question, order=order)
    db.add(c); db.flush()
    for text, correct in options:
        db.add(ChallengeOption(challenge_id=c.id, text=text, correct=correct))

def make_word_bank(db, lesson_id, question, correct_answer, distractors, order):
    c = Challenge(lesson_id=lesson_id, type="WORD_BANK", question=question, order=order)
    db.add(c); db.flush()
    db.add(ChallengeOption(challenge_id=c.id, text=correct_answer, correct=True))
    for d in distractors:
        db.add(ChallengeOption(challenge_id=c.id, text=d, correct=False))

# ── Spanish Lesson 1: Introductions (Highly Mixed) ───────────────────────────
make_select(db, lesson1.id, "Which means 'the man'?",
    [("el hombre", True, "/man.svg"), ("la mujer", False, "/woman.svg"), ("el niño", False, "/boy.svg"), ("la niña", False, "/girl.svg")], 1)
make_fill_in_blanks(db, lesson1.id, "The word for woman is ____",
    [("la mujer", True), ("el hombre", False), ("la niña", False), ("el niño", False)], 2)
make_assist(db, lesson1.id, "el hombre",
    [("the man", True), ("the woman", False), ("the boy", False)], 3)
make_type_answer(db, lesson1.id, "Type the Spanish word for 'hello'", "hola", 4)
make_word_bank(db, lesson1.id, "UNCLE|Write this in English|un café", "a coffee", ["please", "milk", "tea"], 5)
make_match_pairs(db, lesson1.id, "Match the pairs!",
    [("el hombre", "the man"), ("la mujer", "the woman"), ("el niño", "the boy"), ("la niña", "the girl")], 6)

# ── Spanish Lesson 2: Animals (Highly Mixed) ─────────────────────────────────
make_select(db, lesson2.id, "Which means 'the cat'?",
    [("el gato", True, "/cat.svg"), ("el perro", False, "/dog.svg"), ("el pájaro", False, "/bird.svg"), ("el pez", False, "/fish.svg")], 1)
make_fill_in_blanks(db, lesson2.id, "The word for dog is ____",
    [("el perro", True), ("el gato", False), ("el pez", False), ("el pájaro", False)], 2)
make_assist(db, lesson2.id, "el pájaro",
    [("the bird", True), ("the fish", False), ("the cat", False)], 3)
make_type_answer(db, lesson2.id, "Type the Spanish word for 'the dog'", "el perro", 4)
make_word_bank(db, lesson2.id, "BEAR|Write this in English|el gato", "the cat", ["dog", "a", "bird", "fish"], 5)
make_match_pairs(db, lesson2.id, "Match the animals!",
    [("el gato", "the cat"), ("el perro", "the dog"), ("el pájaro", "the bird"), ("el pez", "the fish")], 6)

# ── English Lesson 1: Food (Highly Mixed) ────────────────────────────────────
make_select(db, en_lesson1.id, "Which means 'the apple'?",
    [("the apple", True, "/apple.svg"), ("the bread", False, "/bread.svg"), ("the water", False, "/water.svg"), ("the milk", False, "/milk.svg")], 1)
make_fill_in_blanks(db, en_lesson1.id, "The word for bread is ____",
    [("the bread", True), ("the apple", False), ("the water", False), ("the milk", False)], 2)
make_type_answer(db, en_lesson1.id, "Type the English word for 'water'", "water", 4)
make_word_bank(db, en_lesson1.id, "AUNT|Write this in Spanish|an apple", "una manzana", ["bread", "water", "boy"], 5)
make_match_pairs(db, en_lesson1.id, "Match the food!",
    [("the apple", "la manzana"), ("the bread", "el pan"), ("the milk", "la leche"), ("the water", "el agua")], 6)

# ── English Lesson 2: Animals (Highly Mixed) ─────────────────────────────────
make_select(db, en_lesson2.id, "Which means 'the cat'?",
    [("the cat", True, "/cat.svg"), ("the dog", False, "/dog.svg"), ("the bird", False, "/bird.svg"), ("the fish", False, "/fish.svg")], 1)
make_fill_in_blanks(db, en_lesson2.id, "The word for dog is ____",
    [("the dog", True), ("the cat", False), ("the bird", False), ("the fish", False)], 2)
make_type_answer(db, en_lesson2.id, "Type the English word for 'bird'", "bird", 3)
make_word_bank(db, en_lesson2.id, "BIRD|Write this in Spanish|a cat", "un gato", ["dog", "fish", "bird", "apple"], 4)
make_match_pairs(db, en_lesson2.id, "Match the animals!",
    [("cat", "gato"), ("dog", "perro"), ("bird", "pájaro"), ("fish", "pez")], 5)

# ── French Lesson 1: Animals (Highly Mixed) ──────────────────────────────────
make_select(db, fr_lesson1.id, "Which means 'the cat'?",
    [("le chat", True, "/cat.svg"), ("le chien", False, "/dog.svg"), ("l'oiseau", False, "/bird.svg"), ("le poisson", False, "/fish.svg")], 1)
make_fill_in_blanks(db, fr_lesson1.id, "The word for dog is ____",
    [("le chien", True), ("le chat", False), ("le poisson", False), ("l'oiseau", False)], 2)
make_type_answer(db, fr_lesson1.id, "Type the French word for 'the cat'", "le chat", 4)
make_word_bank(db, fr_lesson1.id, "UNCLE|Write this in English|le chat", "the cat", ["dog", "bird", "fish", "please"], 5)
make_match_pairs(db, fr_lesson1.id, "Match the animals!",
    [("le chat", "the cat"), ("le chien", "the dog"), ("l'oiseau", "the bird"), ("le poisson", "the fish")], 6)

# ── French Lesson 2: Food (Highly Mixed) ─────────────────────────────────────
make_select(db, fr_lesson2.id, "Which means 'the apple'?",
    [("la pomme", True, "/apple.svg"), ("le pain", False, "/bread.svg"), ("l'eau", False, "/water.svg"), ("le lait", False, "/milk.svg")], 1)
make_fill_in_blanks(db, fr_lesson2.id, "The word for bread is ____",
    [("le pain", True), ("la pomme", False), ("l'eau", False), ("le lait", False)], 2)
make_type_answer(db, fr_lesson2.id, "Type the French word for 'milk'", "le lait", 3)
make_match_pairs(db, fr_lesson2.id, "Match the pairs!",
    [("pomme", "apple"), ("pain", "bread"), ("eau", "water"), ("lait", "milk")], 4)


# ── Leaderboard Users (Mock) ─────────────────────────────────────────────────
users_data = [
    ("Nolan", 120, "/mascot.svg"),
    ("Sarah", 95, "/girl.svg"),
    ("James", 80, "/boy.svg"),
    ("Emily", 150, "/woman.svg"),
    ("Michael", 40, "/man.svg"),
    ("Anna", 200, "/girl.svg"),
    ("David", 10, "/boy.svg"),
    ("Sophia", 60, "/woman.svg"),
    ("Robert", 110, "/man.svg"),
    ("Olivia", 180, "/girl.svg")
]
for name, xp, img in users_data:
    u = User(username=name, xp=xp, hearts=10, active_course_id=spanish.id, user_image_src=img, streak=7, last_active_date=datetime.date.today())
    db.add(u)
db.flush()

db.commit()
print("Database seeded successfully with Spanish, English, and French mixed lessons!")