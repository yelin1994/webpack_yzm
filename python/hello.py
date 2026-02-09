import matplotlib.pyplot as plt

# s1 = '12'
# s2 = '34'
# s2.strip()
# result = f"{s1}{s2}"
# # print(result)

# magicians = ['alice', 'david', 'carolina']
# for magician in magicians:
#     print(f"{magician.title()}, that was a great trick!")
# print(f"I can't wait to see your next trick, {magician.title()}.\n")

print(plt.style.available) # 查看可用的样式表
plt.style.use('seaborn-v0_8') # 设置样式表
input_values = [1, 2, 3, 4, 5]
squares = [1, 4, 9, 16, 25]
fig, ax = plt.subplots() # 创建一个图表和一组子图 fig表示图表对象，ax表示子图对象
# ax.scatter(2, 4, 200) # 在子图上绘制散点图
# ax.scatter(input_values, squares, s=100) # 在子图上绘制散点图，s参数设置点的大小
# ax.plot(input_values, squares, linewidth=3) # 在子图上绘制数据，linewidth参数设置线条宽度

x_values = list(range(1, 1001))
y_values = [x**2 for x in x_values]
ax.scatter(x_values, y_values, c = y_values, s=10) # 绘制散点图，点的大小为10
ax.axis([0, 1100, 0, 1100000]) # 设置x轴和y轴的取值范围
# ax.ticklabel_format(style='plain') # 设置坐标轴标签格式为普通数字格式，避免科学计数法
ax.set_title("Square Numbers", fontsize=24) # 设置图表标题及字体大小
ax.set_xlabel("Value", fontsize=14) # 设置x轴标签及字体大小
ax.set_ylabel("Square of Value", fontsize=14) # 设置y轴标签及字体大小
ax.tick_params(labelsize=14) # 设置刻度参数，包括轴和标签字体大小
plt.show() # 显示图表
# plt.savefig('squares_plot.png', bbox_inches='tight') # 将图表保存为文件，bbox_inches参数去除多余空白