import matplotlib.pyplot as plt
from random_walk import RandomWalk

while True:
    # 创建一个随机漫步实例，并绘制点
    rw = RandomWalk()
    rw.fill_walk()
    plt.style.use('classic')
    fig, ax = plt.subplots(figsize=(15, 9)) # 设置图表尺寸 为10x6英寸
    point_numbers = list(range(rw.num_points))
    ax.scatter(rw.x_values, rw.y_values, s=1, c = point_numbers, cmap=plt.cm.Blues, edgecolors='none') 
    # 绘制散点图，点的颜色根据其顺序变化 edgecolors='none'去除点的边框 cmap参数设置颜色图谱
    # 突出起点和终点
    ax.scatter(0, 0, c='green', s=100) # 起点
    ax.scatter(rw.x_values[-1], rw.y_values[-1], c='red', s=100) # 终点

    ax.get_xaxis().set_visible(False) # 隐藏x轴
    ax.get_yaxis().set_visible(False) # 隐藏y轴
    plt.show()
    keep_running = input("Make another walk? (y/n): ")
    if keep_running.lower() == 'n':
        break