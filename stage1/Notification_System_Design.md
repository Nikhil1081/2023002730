# Notification System Design

## Stage 1
This program shows the top 10 unread notifications based on priority.

## Priority Logic
I used 2 things:
1. Notification type
2. Recency

Weights used:
- Placement = 3
- Result = 2
- Event = 1

Formula:
score = (type_weight * 100) + (100 - minutes_ago)

## Steps
1. Read all notifications
2. Filter unread notifications
3. Calculate score
4. Sort in descending order
5. Display top 10

## Efficient Approach for Continuous Updates
If new notifications keep coming, we can use a min-heap of size 10.
This will help maintain only the top 10 notifications without sorting the entire list every time.

## Complexity
Current approach:
- Filtering = O(n)
- Sorting = O(n log n)

Heap-based future approach:
- O(log 10) for each new notification

## Note
This stage is kept simple and uses in-memory data only.
