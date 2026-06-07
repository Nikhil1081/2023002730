from sample_data import notifications
from logger import log


type_weight = {
    "Placement": 3,
    "Result": 2,
    "Event": 1,
}


def get_score(item):
    weight_score = type_weight.get(item["type"], 0) * 100
    recency_score = 100 - item["minutes_ago"]
    return weight_score + recency_score


def get_top_notifications(data, n=10):
    unread = []

    for item in data:
        if not item["read"]:
            item["score"] = get_score(item)
            unread.append(item)
            log(f"Calculated score for notification {item['id']}")

    unread.sort(key=lambda x: x["score"], reverse=True)
    log("Sorted unread notifications by score")
    return unread[:n]


def show_output(items):
    print("\nTop 10 Priority Notifications\n")
    print("-" * 72)
    print(f"{'ID':<5}{'Type':<12}{'Score':<10}{'Message'}")
    print("-" * 72)

    for item in items:
        print(f"{item['id']:<5}{item['type']:<12}{item['score']:<10}{item['message']}")

    print("-" * 72)


def main():
    log("Stage 1 started")
    top_items = get_top_notifications(notifications)
    show_output(top_items)
    log("Stage 1 finished")


if __name__ == "__main__":
    main()
