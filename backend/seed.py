"""
Seed script – wipes DB and re-populates with a full Spanish course.
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
db.add_all([spanish, english])
db.flush()

# ── Units ────────────────────────────────────────────────────────────────────
unit1 = Unit(title="Unit 1", description="Learn the basics of Spanish", order=1, course_id=spanish.id)
unit2 = Unit(title="Unit 2", description="Greetings and phrases",       order=2, course_id=spanish.id)
unit3 = Unit(title="Unit 3", description="Numbers and daily life",      order=3, course_id=spanish.id)

en_unit1 = Unit(title="Unit 1", description="Learn the basics of English", order=1, course_id=english.id)
db.add_all([unit1, unit2, unit3, en_unit1])
db.flush()

# ── Lessons ──────────────────────────────────────────────────────────────────
lesson1 = Lesson(title="Introductions", order=1, unit_id=unit1.id)
lesson2 = Lesson(title="Animals",       order=2, unit_id=unit1.id)
lesson3 = Lesson(title="Colors",        order=3, unit_id=unit1.id)
lesson4 = Lesson(title="Greetings",     order=1, unit_id=unit2.id)
lesson5 = Lesson(title="Food",          order=2, unit_id=unit2.id)
lesson6 = Lesson(title="Numbers",       order=1, unit_id=unit3.id)
lesson7 = Lesson(title="Family",        order=2, unit_id=unit3.id)

en_lesson1 = Lesson(title="Food",       order=1, unit_id=en_unit1.id)
en_lesson2 = Lesson(title="Animals",    order=2, unit_id=en_unit1.id)

db.add_all([lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, en_lesson1, en_lesson2])
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

def make_type_answer(db, lesson_id, question, answer, order):
    """Free-text type-the-answer challenge. Single option = the correct answer."""
    c = Challenge(lesson_id=lesson_id, type="TYPE_ANSWER", question=question, order=order)
    db.add(c); db.flush()
    db.add(ChallengeOption(challenge_id=c.id, text=answer, correct=True))

def make_match_pairs(db, lesson_id, question, pairs, order):
    """
    Match-pairs challenge.
    pairs = list of (word, translation) — both stored as options.
    Format: text = "word|||translation", correct = True (all options are valid pairs)
    """
    c = Challenge(lesson_id=lesson_id, type="MATCH_PAIRS", question=question, order=order)
    db.add(c); db.flush()
    for word, translation in pairs:
        db.add(ChallengeOption(challenge_id=c.id, text=f"{word}|||{translation}", correct=True))

# ── Lesson 1: Introductions ───────────────────────────────────────────────────
make_select(db, lesson1.id, "Which means 'the man'?",
    [("el hombre", True), ("la mujer", False), ("el niño", False), ("la chica", False)], 1)
make_select(db, lesson1.id, "Which means 'the woman'?",
    [("el hombre", False), ("la mujer", True), ("el robot", False), ("el niño", False)], 2)
make_assist(db, lesson1.id, "el hombre",
    [("the man", True), ("the woman", False), ("the boy", False)], 3)
make_type_answer(db, lesson1.id, "Type the Spanish word for 'hello'", "hola", 4)
make_assist(db, lesson1.id, "la mujer",
    [("the man", False), ("the woman", True), ("the girl", False)], 5)
make_match_pairs(db, lesson1.id, "Match the pairs!",
    [("el hombre", "the man"), ("la mujer", "the woman"), ("el niño", "the boy"), ("la niña", "the girl")], 6)

# ── Lesson 2: Animals ─────────────────────────────────────────────────────────
make_select(db, lesson2.id, "Which means 'the cat'?",
    [("el gato", True, "/cat.svg"), ("el perro", False, "/dog.svg")], 1)
make_select(db, lesson2.id, "Which means 'the dog'?",
    [("el gato", False, "/cat.svg"), ("el perro", True, "/dog.svg")], 2)
make_assist(db, lesson2.id, "el pájaro",
    [("the bird", True), ("the fish", False), ("the cat", False)], 3)
make_type_answer(db, lesson2.id, "Type the Spanish word for 'the dog'", "el perro", 4)
make_match_pairs(db, lesson2.id, "Match the animals!",
    [("el gato", "cat"), ("el perro", "dog"), ("el pájaro", "bird"), ("el pez", "fish")], 5)

# ── Lesson 3: Colors ──────────────────────────────────────────────────────────
make_select(db, lesson3.id, "Which means 'red'?",
    [("rojo", True), ("azul", False), ("verde", False), ("amarillo", False)], 1)
make_select(db, lesson3.id, "Which means 'blue'?",
    [("rojo", False), ("azul", True), ("negro", False), ("blanco", False)], 2)
make_assist(db, lesson3.id, "verde",
    [("green", True), ("red", False), ("yellow", False)], 3)
make_type_answer(db, lesson3.id, "Type the Spanish word for 'yellow'", "amarillo", 4)
make_match_pairs(db, lesson3.id, "Match the colors!",
    [("rojo", "red"), ("azul", "blue"), ("verde", "green"), ("amarillo", "yellow")], 5)

# ── Lesson 4: Greetings ───────────────────────────────────────────────────────
make_select(db, lesson4.id, "Which means 'hello'?",
    [("hola", True), ("adiós", False), ("gracias", False), ("por favor", False)], 1)
make_select(db, lesson4.id, "Which means 'goodbye'?",
    [("hola", False), ("adiós", True), ("buenos días", False), ("buenas noches", False)], 2)
make_assist(db, lesson4.id, "gracias",
    [("thank you", True), ("please", False), ("hello", False)], 3)
make_type_answer(db, lesson4.id, "Type the Spanish word for 'please'", "por favor", 4)
make_select(db, lesson4.id, "Which means 'good morning'?",
    [("buenos días", True), ("buenas noches", False), ("buenas tardes", False), ("hola", False)], 5)

# ── Lesson 5: Food ────────────────────────────────────────────────────────────
make_select(db, lesson5.id, "Which means 'the apple'?",
    [("la manzana", True, "/apple.svg"), ("el pan", False, "/bread.svg"), ("el agua", False, "/water.svg")], 1)
make_select(db, lesson5.id, "Which means 'the bread'?",
    [("la manzana", False, "/apple.svg"), ("el pan", True, "/bread.svg"), ("la leche", False, "/milk.svg")], 2)
make_assist(db, lesson5.id, "el agua",
    [("the water", True), ("the milk", False), ("the juice", False)], 3)
make_type_answer(db, lesson5.id, "Type the Spanish word for 'milk'", "la leche", 4)
make_match_pairs(db, lesson5.id, "Match the foods!",
    [("la manzana", "apple"), ("el pan", "bread"), ("el agua", "water"), ("la leche", "milk")], 5)

# ── Lesson 6: Numbers ─────────────────────────────────────────────────────────
make_select(db, lesson6.id, "Which means 'one'?",
    [("uno", True), ("dos", False), ("tres", False), ("cuatro", False)], 1)
make_select(db, lesson6.id, "Which means 'five'?",
    [("tres", False), ("cuatro", False), ("cinco", True), ("seis", False)], 2)
make_type_answer(db, lesson6.id, "Type the Spanish word for 'ten'", "diez", 3)
make_match_pairs(db, lesson6.id, "Match the numbers!",
    [("uno", "one"), ("dos", "two"), ("tres", "three"), ("cuatro", "four"), ("cinco", "five")], 4)

# ── Lesson 7: Family ─────────────────────────────────────────────────────────
make_select(db, lesson7.id, "Which means 'mother'?",
    [("la madre", True), ("el padre", False), ("el hermano", False), ("la hermana", False)], 1)
make_assist(db, lesson7.id, "el padre",
    [("the father", True), ("the mother", False), ("the brother", False)], 2)
make_type_answer(db, lesson7.id, "Type the Spanish word for 'brother'", "el hermano", 3)
make_match_pairs(db, lesson7.id, "Match the family members!",
    [("la madre", "mother"), ("el padre", "father"), ("el hermano", "brother"), ("la hermana", "sister")], 4)

# ── ENGLISH COURSE (New) ─────────────────────────────────────────────────────
make_select(db, en_lesson1.id, "Which means 'the apple'?",
    [("the apple", True, "/apple.svg"), ("the bread", False, "/bread.svg")], 1)
make_select(db, en_lesson1.id, "Which means 'the bread'?",
    [("the apple", False, "/apple.svg"), ("the bread", True, "/bread.svg")], 2)
make_match_pairs(db, en_lesson1.id, "Match the pairs!",
    [("apple", "manzana"), ("bread", "pan"), ("water", "agua"), ("milk", "leche")], 3)

make_select(db, en_lesson2.id, "Which means 'the cat'?",
    [("the cat", True, "/cat.svg"), ("the dog", False, "/dog.svg")], 1)
make_select(db, en_lesson2.id, "Which means 'the dog'?",
    [("the cat", False, "/cat.svg"), ("the dog", True, "/dog.svg")], 2)
make_match_pairs(db, en_lesson2.id, "Match the pairs!",
    [("cat", "gato"), ("dog", "perro"), ("bird", "pájaro"), ("fish", "pez")], 3)

# ── Users (learner + leaderboard seeds) ──────────────────────────────────────
today = datetime.date.today()
yesterday = today - datetime.timedelta(days=1)

users_data = [
    ("Learner",  "/avatars/1.svg",  120, 7,  5, spanish.id, yesterday),
    ("Alice",    "/avatars/2.svg",  980, 14, 5, spanish.id, today),
    ("Bob",      "/avatars/3.svg",  760, 10, 4, spanish.id, yesterday),
    ("Carlos",   "/avatars/4.svg",  540, 5,  5, spanish.id, today),
    ("Diana",    "/avatars/5.svg",  430, 3,  3, spanish.id, yesterday),
    ("Eve",      "/avatars/6.svg",  320, 2,  5, spanish.id, today),
    ("Frank",    "/avatars/7.svg",  210, 1,  4, spanish.id, None),
    ("Grace",    "/avatars/8.svg",  150, 8,  5, spanish.id, yesterday),
    ("Henry",    "/avatars/9.svg",   90, 4,  2, spanish.id, None),
    ("Ivy",      "/avatars/10.svg",  50, 1,  5, spanish.id, today),
]

created_users = []
for username, img, xp, streak, hearts, course_id, last_date in users_data:
    u = User(
        username=username, user_image_src=img, xp=xp, streak=streak,
        hearts=hearts, active_course_id=course_id, last_active_date=last_date
    )
    db.add(u)
    created_users.append(u)

db.flush()

# Mark lesson 1 + 2 complete for the main learner (so they start at lesson 3)
main_user = created_users[0]
for lesson in [lesson1, lesson2]:
    db.add(UserProgress(user_id=main_user.id, lesson_id=lesson.id, completed=True, score=80))
    for challenge in lesson.challenges:
        db.add(ChallengeProgress(user_id=main_user.id, challenge_id=challenge.id, completed=True))

db.commit()
db.close()
print("Database seeded successfully!")
print(f"   - 1 course (Spanish) with 3 units, 7 lessons, varied challenge types")
print(f"   - Challenge types: SELECT, ASSIST, TYPE_ANSWER, MATCH_PAIRS")
print(f"   - {len(users_data)} users seeded (leaderboard ready)")