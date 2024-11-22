#importer
import copy
from collections import OrderedDict
from datetime import datetime
import math
import numpy as np
import os
import pandas as pd
import random
import sys
import time

import tkinter as tk
from tkinter import filedialog, Toplevel, Menu

import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

from GA import *

#Here we define certain variables that we want to be global, this to be able to easily save what the user presses in the GUI. We set them all to None to begin with.
selected_excel_file = None
selected_csv_file = None
selected_setup_time = None
manual_input = None
best_solution_copy = None
process_steps = None
processing_times = None
product_paths = None
pallet_amount = None
input_list = None

#Here we define the function that is connected to the "Browse" button for selecting the excel file
def choose_excel_file(excel_screen):   
    global selected_excel_file #We set this variable to global so that we can later use selected_excel_file when we run the program and retrieve information from the excel sheet.
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx *.xls")]) #Here we set the file_path variable and only give the user the ability to open excel files
    #If file_path == True, i.e. a correct file has been selected
    if file_path:
        selected_excel_file = file_path  #Here we set file_path to the global variable selected_excel_file so that the file path is saved globally.
        excel_screen.delete('1.0', 'end')  #So that there won't be a lot of text that is built on top of each other, we empty the box before we print anything.
        excel_screen.insert('end', os.path.basename(file_path))  #Here we enter only the name of the Excel file and not the entire file path
    return selected_excel_file

#Here we define the function that is connected to the "Browse" button for selecting the CSV file
def choose_csv_file(csv_screen):
    global selected_csv_file #We set this variable to global so that we can later use selected_excel_file when we run the program and retrieve information from the excel sheet.
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", ".xlsx *.xls")])#Here we set the file_path variable and only give the user the ability to open excel files
    #If file_path == True, i.e. a correct file has been selected
    if file_path:
        selected_csv_file = file_path  #Here we set file_path to the global variable selected_csv_file so that the file path is saved globally.
        csv_screen.delete('1.0', 'end')  #So that there won't be a lot of text that is built on top of each other, we empty the box before we print anything.
        csv_screen.insert('end', os.path.basename(file_path))  #Here we enter only the name of the selected file and not the entire file path
    return selected_csv_file

def choose_setup_time(setup_time_screen):
    global selected_setup_time #We set this variable to global so that we can later use selected_excel_file when we run the program and retrieve information from the excel sheet.
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", ".xlsx *.xls")])#Here we set the file_path variable and only give the user the ability to open excel files

    #If file_path == True, i.e. a correct file has been selected
    if file_path:
        selected_setup_time = file_path  #Here we set file_path to the global variable selected_csv_file so that the file path is saved globally.
        setup_time_screen.delete('1.0', 'end')  #So that there won't be a lot of text that is built on top of each other, we empty the box before we print anything.
        setup_time_screen.insert('end', os.path.basename(file_path))  #Here we enter only the name of the selected file and not the entire file path
    return selected_setup_time

#Here the "Save" button is defined to save your own entered string
def save_entry_text(output_screen, entry_1):
    global manual_input
    manual_input = entry_1.get("1.0", tk.END).strip()  
    output_screen.delete('1.0', tk.END)
    output_screen.insert('end', f"Manual input saved: {manual_input}")

#Here we define the function linked to the "optimal amount of pallets" button
def toggle_pallet(button_pallet, button_image_pallet, button_image_pallet_checked, output_screen, pallet_var):
    if pallet_var.get() == 1:
        pallet_var.set(0)
        button_pallet.config(image=button_image_pallet) #If you have not clicked in the box for optimal amount of pallets, it will be empty
        output_screen.delete('1.0', 'end')  #So that there won't be a lot of text that is built on top of each other, we empty the box before we print anything.
        output_screen.insert('end', "Disabled")
    else:
        pallet_var.set(1)
        button_pallet.config(image=button_image_pallet_checked) #If you clicked in the box, the box will get a check mark, you can replace that png by putting another png in the assets folder
        output_screen.delete('1.0', 'end')  #So that there won't be a lot of text that is built on top of each other, we empty the box before we print anything.
        output_screen.insert('end', "Enabled")
    
    return pallet_var

# This function means that when you click on the "del" button, the selected excel file is deleted both from the memory and from the box
def clear_excel_screen(screen):
    selected_excel_file = None
    screen.delete('1.0', tk.END)
    return selected_excel_file

# This function means that when you click on the "del" button, the selected sequence file is deleted both from the memory and from the box
def clear_csv_screen(screen):
    selected_csv_file = None
    screen.delete('1.0', tk.END)
    return selected_csv_file

# This function means that when you click on the "del" button, the selected set time file is deleted both from the memory and from the box
def clear_setup_time_screen(screen):
    selected_setup_time = None
    screen.delete('1.0', tk.END)
    return selected_setup_time

#Here is the function to run the entire program, i.e. when you have selected all the files and if you want rerun or not, you click on the "Run" button.
def run_optimization(output_screen, window, progress, pallet_var, excel_screen, csv_screen, setup_time_screen, entry_1):
    global selected_excel_file, selected_csv_file, selected_setup_time, manual_input, best_solution_copy, process_steps, processing_times, product_paths, input_list, pallet_amount, setup_times_dict, val_list, pallets, best_pallet_config, output_pallets #Here we have our global variables used by the genetic algorithm

    #Here we check all the fields and see if they are empty or not, if they are empty, the value is set to None (Ie if you selected a file and then just manually removed it from the field and did not click "Share")
    selected_excel_file = check_screen(excel_screen, selected_excel_file)
    selected_csv_file = check_screen(csv_screen, selected_csv_file)
    selected_setup_time = check_screen(setup_time_screen, selected_setup_time)
    manual_input = check_screen(entry_1, manual_input)

    #If you have not selected an excel file, you will receive an error message
    if not selected_excel_file:
        output_screen.delete('1.0', 'end')
        output_screen.insert('end',"Please select the main Excel file (that includes the production line layout).")
        return

    excel_file = selected_excel_file #Here we put the selected excel file in a new variable.
    try:
        #Load the Excel sheet as a pandas dataframe object
        process_steps_df = pd.read_excel(excel_file, sheet_name='Process_Steps')
        product_paths_df = pd.read_excel(excel_file, sheet_name='Product_Paths')
        processing_times_df = pd.read_excel(excel_file, sheet_name='Processing_Times')
        product_amount_df = pd.read_excel(excel_file, sheet_name='Product_Amount')
        pallet_amount_df = pd.read_excel(excel_file, sheet_name='Pallets')

        #Turn the Dataframe objects into dictionaries where the first bracket is the key and [] is the value associated with that key.
        product_amount_nostr = product_amount_df.set_index('Product')['Amount'].apply(math.ceil).to_dict()
        process_steps_nostr = process_steps_df.set_index('Step name')['Capacity'].to_dict()
        processing_times_nostr = processing_times_df.set_index('Step name').to_dict('index')
        product_paths_nostr = product_paths_df.set_index('Product').to_dict('list')
        pallet_amount_nostr = pallet_amount_df.set_index('pallet_group')['pallet_amount'].apply(math.ceil).to_dict()

        if selected_setup_time is not None:
            setup_time_excel_file = selected_setup_time
            setup_time_xls = pd.ExcelFile(setup_time_excel_file)
            setup_times_dict = {}

            # Iterate over all excel sheets
            for sheet_name in setup_time_xls.sheet_names:
                setup_time_df = setup_time_xls.parse(sheet_name, index_col=0)
                setup_times_dict[sheet_name.lower()] = {}

                for row in setup_time_df.index:
                    for col in setup_time_df.columns:
                        key = (str(row) + str(col)).lower()
                        value = setup_time_df.loc[row, col]
                        if pd.notna(value):  # Check if the value is nan
                            setup_times_dict[sheet_name.lower()][key] = float(value)  # Convert the value to float if necessary

        #Function that iterates through all the keys in our dictionaries to make sure to remove spaces before processing steps in the excel file.
        #Also make sure that all strings are lowercase so that it doesn't matter if you wrote differently in the different sheets, e.g. (Vision control and vision control)
        def keys_lower(keys):
            if isinstance(keys, str):
                return keys.strip().lower()
            return keys

        #Here we set all keys in the dictionary to string so that any spaces in the excel file do not matter.
        product_amount = {str(keys_lower(key)): keys_lower(value) for key, value in product_amount_nostr.items()}
        process_steps = {str(keys_lower(key)): keys_lower(value) for key, value in process_steps_nostr.items()}
        processing_times = {str(keys_lower(key)): {str(keys_lower(inner_key)): keys_lower(inner_value) for inner_key, inner_value in value.items()} for key, value in processing_times_nostr.items()}
        product_paths = {str(keys_lower(key)): [keys_lower(item) for item in value] for key, value in product_paths_nostr.items()}
        pallet_amount = {str(keys_lower(key)): keys_lower(value) for key, value in pallet_amount_nostr.items()}

    except Exception as E:
        output_screen.insert('end',f"ERROR: Please check the Excel file. {E}")
        return
    
    #Parameters, change at will
    population_size = 20
    num_generations = 1000 # change if it takes too long to run
    num_parents = 2
    mutation_rate = 0.05
    elitism_ratio = 0.1
    buffer_ratio = 1.2 #DO NOT CHANGE
    offspring_size = int((population_size - num_parents) * buffer_ratio)
    tolerance_percent = 0  # How much difference between the optimal value (inf palettes) and the desired value (5 = 5%)

    output_pallets = []
    generation_list = []
    best_fitness = math.inf
    best_solution = None
    best_solution_cleaned = ""
    generations_without_change = 0
    max_generations_without_change = 250
    
    output_screen.delete('1.0', 'end') #We have this line of code here to empty the output box if you would like to run the program again without shutting it down
  
    #Here we have an if statement if you have selected a specific product sequence you want to try, if you have selected a product sequence then selected_csv_file will be True
    if selected_csv_file != None or manual_input != None:
        #We then try to read the file selected to verify that the structure is correct.
        try:
            if selected_csv_file != None:
                df = pd.read_excel(selected_csv_file)  
                csv_seq = df['Artikelnr'].to_list() #Here we choose which column we want to read from
            else: 
                csv_seq = manual_input

            sequence = csv_seq #Here we add csv_seq to sequence so that we can then remove any unnecessary characters and make everything lowercase
            if "," in sequence:
                input_list = [element.strip().strip("'").lower() for element in sequence.split(',')]
            else:
                input_list = [char.lower() for char in sequence]

            local_amount = {} #Here we create a dictionary where we add the specific amount of products that are in the selected sequence (It may be that this amount differs from the main excel file)
            for element in input_list:
                local_amount[element] = local_amount.get(element, 0) + 1
            population = [input_list.copy() for _ in range(population_size)] #Finally, we create a population where the amount depends on the population_size parameter
            output_screen.insert('end', "Excel has been read correctly \n")
            output_screen.update_idletasks()  #Update GUI
            time.sleep(0.5)
            output_screen.insert('end', "Custom sequence has been read correctly \n")
            if choose_setup_time != None:
                output_screen.update_idletasks()  #Update GUI
                time.sleep(0.5)
                output_screen.insert('end', "Setup times have been read correctly \n")
            output_screen.see(tk.END)
            output_screen.update_idletasks()  #Update GUI
            time.sleep(0.5)
        except Exception as E:
            output_screen.insert('end',f"Error processing CSV input: {E}\n") #If there is something strange about the entered sequence, you will get an error message
            output_screen.update_idletasks()  #Update GUI
            time.sleep(0.5)
            output_screen.insert('end', f"Optimizing without a custom sequence...\n")
            local_amount = product_amount #Here we set local_amount to product_amount which is the amount specified in the main excel
            input_list = init_list(local_amount)
            population = init_population(local_amount, population_size) #Samt creates a population based on the information from the excel file and not from the own sequence you entered
    else:
        output_screen.insert('end', "Excel has been read correctly \n")
        if choose_setup_time != None:
            output_screen.update_idletasks()  #Update GUI
            time.sleep(0.5)
            output_screen.insert('end', "Setup times have been read correctly \n")
        output_screen.update_idletasks()  #Update GUI
        time.sleep(0.5)    
        output_screen.insert('end',"Optimizing without a custom sequence... \n") #If there should be something strange with the entered sequence, or if you run without your own entered sequence, you will receive this message
        output_screen.update_idletasks()
        output_screen.see(tk.END)
        time.sleep(0.5)

        local_amount = product_amount #Here we set local_amount to product_amount which is the amount specified in the main excel
        input_list = init_list(local_amount)
        population = init_population(local_amount, population_size) #Samt creates a population based on the information from the excel file and not from the own sequence you entered

    progress["maximum"] = num_generations

    #If you clicked on the button that you want to find out the best number of palettes for your sequence, this will be executed
    if pallet_var.get() == 1:
        global fitness_list
        pallets = pallet_amount
        for x in pallets:
            pallets[x] = 1

        try:
            if selected_setup_time is not None:
                initial_fitness = fitness(population, pallets, process_steps, processing_times, product_paths, setup_times_dict)
            else:
                initial_fitness = fitness_no_setup_time(population, pallets, process_steps, processing_times, product_paths)

        except Exception as E:
            output_screen.insert('end', f"Error processing input: {E}")
            local_amount = copy.deepcopy(product_amount)
            population = init_population(product_amount, population_size)


        # Parameters
        val_list = []
        improvement_threshold = 0.025  # difference in percentage, 0.05 = 5%

        best_overall_fitness = min([x[1] for x in initial_fitness])
        best_pallet_config = pallets.copy()

        for i in range(20):  # doesn't really matter which range, big enough that it has time to drive just a little
            pallets = best_pallet_config.copy()
            improved = False

            for j in pallets:
                # This is the usual main loop, found below.
                previous_amount = pallets[j]
                pallets[j] += 1

                best_fitness_list = []
                generation_list = []
                best_fitness = math.inf
                best_solution_copy = None

                offspring_size = int((population_size - num_parents) * buffer_ratio)
                for generation in range(num_generations):
                    generation_list.append(generation)
                    progress["value"] = generation #Here we set how far the program has run based on which generation we are on
                    window.update_idletasks()  #Update GUI

                    if selected_setup_time is not None:
                        fitness_population = fitness(population, pallets, process_steps, processing_times, product_paths, setup_times_dict)
                    else:
                        fitness_population = fitness_no_setup_time(population, pallets, process_steps, processing_times, product_paths)
                    
                    parents = [tournament_selection(fitness_population) for _ in range(num_parents)]
                    offspring = []

                    while len(offspring) < offspring_size:
                        parent1, parent2 = random.sample(parents, 2)
                        offspring.extend(crossover(parent1, parent2, offspring_size - len(offspring)))

                    offspring = adaptive_mutation(offspring, mutation_rate, generation, num_generations)
                    combined = parents + [child for child in offspring if enforce_quantity_constraint(child, local_amount)]

                    if len(combined) < population_size:
                        needed = population_size - len(combined)
                        combined.extend(init_population(local_amount, needed))

                    num_elites = int(population_size * elitism_ratio)
                    elites = sorted(fitness_population, key=lambda x: x[1])[:num_elites]
                    elites = [elite[0] for elite in elites]

                    population = elites + combined[:population_size - num_elites]

                    current_best_fitness = min([x[1] for x in fitness_population])
                    best_fitness_list.append(current_best_fitness)
                    if current_best_fitness < best_fitness:
                        best_fitness = current_best_fitness
                        best_solution_copy = copy.deepcopy(next(x[0] for x in fitness_population if x[1] == best_fitness))

                output_screen.insert('end',f"Iteration {i}, Pallet group {j}: {pallets}, Fitness: {best_fitness}\n")
                output_screen.see(tk.END)
                pallets_updated = pallets.copy()
                output_pallets.append(list((pallets_updated, best_fitness)))
                val_list.append(best_fitness)
                # Checks how much change
                if (best_overall_fitness - best_fitness) / best_overall_fitness > improvement_threshold:
                    best_overall_fitness = best_fitness
                    best_pallet_config = pallets.copy()
                    improved = True
                    output_screen.insert('end',f"Improvement found: New best fitness = {best_overall_fitness}\n")
                    output_screen.see(tk.END)
                else:
                    # if not enough, revert to previous
                    pallets[j] = previous_amount

            # If none of the product groups (pallets) have improved, cancel
            if not improved:
                output_screen.insert('end',"\nNo significant improvement in this iteration. Stopping optimization.")
                output_screen.see(tk.END)
                break
    
        index = val_list.index(best_fitness)
        val_list = val_list[0:index + 1]
        output_screen.insert('end',f"\nFinal optimized pallet configuration: {best_pallet_config}\n")
        output_screen.insert('end',f"Best overall fitness: {min(val_list)}\n")
        output_screen.insert('end',f"Fitness history: {val_list}")
        output_screen.see(tk.END)

    else:
        for generation in range(num_generations):
            generation_list.append(generation)
            if selected_setup_time is not None:
                fitness_population = fitness(population, pallet_amount, process_steps, processing_times, product_paths, setup_times_dict)
            else:
                fitness_population = fitness_no_setup_time(population, pallet_amount, process_steps, processing_times, product_paths)

            parents = [tournament_selection(fitness_population) for _ in range(num_parents)]
            offspring = []

            #As long as the length of the offspring is less than the offspring size, we create new offspring
            while len(offspring) < offspring_size:
                parent1, parent2 = random.sample(parents, 2)
                offspring.extend(crossover(parent1, parent2, offspring_size - len(offspring)))

            offspring = adaptive_mutation(offspring, mutation_rate, generation, num_generations)
            combined = parents + [child for child in offspring if enforce_quantity_constraint(child, local_amount)] #Here we add all offsprings and parents to a new population and check that all individuals follow restrictions, i.e. that there is the same amount of all products as we started with.

            #Here we make sure that we always have the right size of the new population, if it does not match, we create more individuals that are added to the new population
            if len(combined) < population_size:
                needed = population_size - len(combined)
                combined.extend(init_population(local_amount, needed))

            #Here we bring out elites based on our elitism_ratio and sort the population and save the best individuals for the next generation.
            num_elites = int(population_size * elitism_ratio)
            elites = sorted(fitness_population, key=lambda x: x[1])[:num_elites]
            elites = [elite[0] for elite in elites]

            population = elites + combined[:population_size - num_elites]

            current_best_fitness = min([x[1] for x in fitness_population])#We save down the best sequence and its fitness value

            #If this generation's best fitness is better than previously measured fitness values, it becomes the new global best fitness.
            if current_best_fitness < best_fitness:
                best_fitness = current_best_fitness
                best_solution = next(x[0] for x in fitness_population if x[1] == best_fitness)
                best_solution_copy = copy.deepcopy(best_solution)
                generations_without_change = 0
            else:
                generations_without_change += 1

            if generations_without_change > max_generations_without_change:
                for individual in population:
                    random.shuffle(individual)
                generations_without_change = 0    

            progress["value"] = generation #Here we set how far the program has run based on which generation we are on
            window.update_idletasks()  # Update the GUI

        #For loop loops through the best solution and saves it without any special characters
        for i in best_solution_copy:
            best_solution_cleaned += i
            best_solution_cleaned += " "

        #This function prints out all the information the user might want to see
        if selected_setup_time is not None:
            print_statistics(input_list, best_solution_copy, process_steps, processing_times, product_paths, output_screen, best_solution_cleaned, setup_times_dict, tolerance_percent, best_fitness)
        else:
            print_statistics_no_setup_time(input_list, best_solution_copy, process_steps, processing_times, product_paths, output_screen, best_solution_cleaned, tolerance_percent, best_fitness)

#This function retrieves all statistics and prints it out in the output box (It does the same thing as the machine occupancy graphs but skips plotting the graph)
def print_statistics(input_list, best_solution, process_steps, processing_times, product_paths, output_screen, best_solution_cleaned, setup_times_dict, tolerance_percent, best_fitness):
    try:
        initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
        optimized_occupancy = calculate_occupancy(best_solution, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)   

        initial_utilization, initial_total_time = calculate_utilization(initial_occupancy)
        optimized_utilization, optimized_total_time = calculate_utilization(optimized_occupancy)
        
        time_improvement = initial_total_time - optimized_total_time
        percentage_improvement = (time_improvement / initial_total_time) * 100
        
        avg_initial_utilization = sum(initial_utilization.values()) / len(initial_utilization)
        avg_optimized_utilization = sum(optimized_utilization.values()) / len(optimized_utilization)

        minimal_pallet_amount = find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent, setup_times_dict)
        pallet_fitness = fitness([best_solution], minimal_pallet_amount, process_steps, processing_times, product_paths, setup_times_dict)

        output_screen.insert('end', f"\nInitial total production time: {initial_total_time:.2f} \n")
        output_screen.insert('end', f"Optimized total production time: {optimized_total_time:.2f} \n")
        output_screen.insert('end', f"Time improvement: {time_improvement:.2f} ({percentage_improvement:.2f}%) \n")
        output_screen.insert('end', f"Average initial total machine utilization: {avg_initial_utilization:.2f}% \n")
        output_screen.insert('end', f"Average optimized total machine utilization: {avg_optimized_utilization:.2f}% \n")
        output_screen.insert('end', f"Utilization improvement: {avg_optimized_utilization - avg_initial_utilization:.2f}%\n")
        output_screen.insert('end', f"\nMaximum amount of pallets used for this sequence:\n{minimal_pallet_amount}\n")
        output_screen.insert('end', f"\nThe amount of pallets defined in the Excel:\n{pallet_amount}\n")
        output_screen.insert('end', f"\nTotal time with optimized amount of pallets: {pallet_fitness[0][1]}")
        output_screen.insert('end', f"\nTotal time with the amount of pallets in the Excel: {best_fitness}\n")
        output_screen.insert('end', f"\nThe best sequence of products: {best_solution_cleaned}")
        output_screen.see(tk.END)

    except Exception as E:
        output_screen.insert('end', f"\nNo optimization could be done for this sequence (ERROR: {E})")
        output_screen.see(tk.END)

#This function retrieves all statistics and prints it out in the output box (It does the same thing as the machine occupancy graphs but skips plotting the graph)
def print_statistics_no_setup_time(input_list, best_solution, process_steps, processing_times, product_paths, output_screen, best_solution_cleaned, tolerance_percent, best_fitness):
    try:
        initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
        optimized_occupancy = calculate_occupancy_no_setup_time(best_solution, process_steps, processing_times, product_paths, pallet_amount)   
        
        initial_utilization, initial_total_time = calculate_utilization(initial_occupancy)
        optimized_utilization, optimized_total_time = calculate_utilization(optimized_occupancy)
        
        time_improvement = initial_total_time - optimized_total_time
        percentage_improvement = (time_improvement / initial_total_time) * 100
        
        avg_initial_utilization = sum(initial_utilization.values()) / len(initial_utilization)
        avg_optimized_utilization = sum(optimized_utilization.values()) / len(optimized_utilization)

        minimal_pallet_amount = find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent, setup_times_dict= None)
        pallet_fitness = fitness_no_setup_time([best_solution], minimal_pallet_amount, process_steps, processing_times, product_paths)

        output_screen.insert('end', f"\nInitial total production time: {initial_total_time:.2f} \n")
        output_screen.insert('end', f"Optimized total production time: {optimized_total_time:.2f} \n")
        output_screen.insert('end', f"Time improvement: {time_improvement:.2f} ({percentage_improvement:.2f}%) \n")
        output_screen.insert('end', f"Average initial total machine utilization: {avg_initial_utilization:.2f}% \n")
        output_screen.insert('end', f"Average optimized total machine utilization: {avg_optimized_utilization:.2f}% \n")
        output_screen.insert('end', f"Utilization improvement: {avg_optimized_utilization - avg_initial_utilization:.2f}%\n")
        output_screen.insert('end', f"\nMaximum amount of pallets used for this sequence:\n{minimal_pallet_amount}\n")
        output_screen.insert('end', f"\nThe amount of pallets defined in the Excel:\n{pallet_amount}\n")
        output_screen.insert('end', f"\nTotal time with optimized amount of pallets: {pallet_fitness[0][1]}")
        output_screen.insert('end', f"\nTotal time with the amount of pallets in the Excel: {best_fitness}\n")
        output_screen.insert('end', f"\nThe best sequence of products: {best_solution_cleaned}")
        output_screen.see(tk.END)
    except Exception as E:
        output_screen.insert('end', f"\nNo optimization could be done for this sequence {E}")
        output_screen.see(tk.END)

#checks if the value is "approved" and within the frame you set with tolerance_percent
def is_in_tolerance(target, value, tolerance_percent):
    return (target * (1 - tolerance_percent / 100)) <= value <= (target * (1 + tolerance_percent / 100))

# Function to find the minimum value
def find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent,  pallet_amount, setup_times_dict):
    # Starts palettes with high values
    local_pallet_amount = copy.deepcopy(pallet_amount)  
    #for i in local_pallet_amount: #This is necessary IF the values ​​in excel are odef/inf
        #local_pallet_amount[i] = 1000 #Sets the initial values

    # A "binary search" algorithm to find the smallest set of groups
    # starts with low and high value, (1 and 1000) and palette group (E.g. palette group a,b,c)
    # calculates if the middle value of both numbers is the same fitness as with infinite palettes
    # If the value is reasonable, try a smaller value :high = mid
    # if it's out of range try a higher value :low = mid + 1 
    # Do this until low = high, which returns the minsat value
    def binary_search(group, low, high):
        while low < high:
            mid = (low + high) // 2
            temp_pallet_amount = copy.deepcopy(local_pallet_amount)
            temp_pallet_amount[group] = mid
            
            #Calculates fitness value using the current mean value
            if selected_setup_time is not None:
                pallet_fitness = fitness([best_solution], temp_pallet_amount, process_steps, processing_times, product_paths, setup_times_dict)
                current_fitness_val = pallet_fitness[0][1]
            else:
                pallet_fitness = fitness_no_setup_time([best_solution], temp_pallet_amount, process_steps, processing_times, product_paths)
                current_fitness_val = pallet_fitness[0][1]

            #checks if fitness is within okay range
            if is_in_tolerance(best_fitness, current_fitness_val, tolerance_percent):
                high = mid  # tries to find smaller values
            else:
                low = mid + 1  # increase the value
        return low 

    # Find the minimum amount per group
    for group in local_pallet_amount.keys():
        local_pallet_amount[group] = binary_search(group, 1, local_pallet_amount[group]) #Insert pallet group, "low-number" (1) and the high pallet amount for the group
    return local_pallet_amount

#This function saves the best sequence to a csv file
def export_to_csv(output_screen):
    if best_solution_copy != None:
        output_screen.delete('1.0', 'end')
        output_screen.insert('end',"Exporting to CSV...")
        out_df = pd.DataFrame(best_solution_copy, columns=['Product'])
        out_df.to_excel('output.xlsx', index=False, sheet_name='Products')
    else:
        output_screen.delete('1.0', 'end')
        output_screen.insert('end', "No data to export")

#Here the "Exit" button is defined to close the program
def exit_program(window):
    window.quit()
    window.destroy()
    sys.exit()

def calculate_occupancy(sequence, process_steps, processing_times, product_paths, max_products_per_group, setup_times_dict):
    products_in_process = []
    occupancy = {step: [] for step in process_steps if 'buffer' not in step.lower()}
    machine_availability = {step: [0] * process_steps[step] for step in process_steps}
    previous_product = None
    #This is the same as the fitness function, although we check the time the machine is used
    for product in sequence: 
        steps = [step for step in product_paths[product] if not pd.isnull(step) and 'buffer' not in step.lower()]
        s_time = 0
        product_start_time = 0
        
        group_key = next(key for key in max_products_per_group if product in key)
        max_concurrent_products = max_products_per_group[group_key]

        while sum(1 for p in products_in_process if p[0] in group_key) >= max_concurrent_products:
            earliest_finish = min(products_in_process, key=lambda x: x[1])
            products_in_process.remove(earliest_finish)
            product_start_time = max(product_start_time, earliest_finish[1])
            
        for step in steps:
            process_time = processing_times[step].get(product, 0)
                
            if previous_product is not None and process_time > 0:
                setup_time_key = (previous_product + product).lower()
                s_time = setup_times_dict.get(step.lower(), {}).get(setup_time_key, 0)

            if process_time > 0:
                earliest_available = min(machine_availability[step])
                start_time = max(product_start_time, earliest_available)
                end_time = start_time + process_time + s_time

                machine_index = machine_availability[step].index(earliest_available) #Here we check the time the machine is used instead of the product
                machine_availability[step][machine_index] = end_time

                occupancy[step].append((start_time, end_time, product)) #adds start time, end time and product in process
                product_start_time = end_time

        products_in_process.append((product, product_start_time))
        previous_product = str(product)

    return occupancy 
        
    
def calculate_occupancy_no_setup_time(sequence, process_steps, processing_times, product_paths, max_products_per_group):
    #same as above, but without set time
    products_in_process = []
    occupancy = {step: [] for step in process_steps if 'buffer' not in step.lower()}
    machine_availability = {step: [0] * process_steps[step] for step in process_steps}
    for product in sequence: 
        steps = [step for step in product_paths[product] if not pd.isnull(step) and 'buffer' not in step.lower()]
        product_start_time = 0
        
        group_key = next(key for key in max_products_per_group if product in key)
        max_concurrent_products = max_products_per_group[group_key]

        while sum(1 for p in products_in_process if p[0] in group_key) >= max_concurrent_products:
            earliest_finish = min(products_in_process, key=lambda x: x[1])
            products_in_process.remove(earliest_finish)
            product_start_time = max(product_start_time, earliest_finish[1])
            
        for step in steps:
            process_time = processing_times[step].get(product, 0)
            if process_time > 0:
                earliest_available = min(machine_availability[step])
                start_time = max(product_start_time, earliest_available)
                end_time = start_time + process_time

                machine_index = machine_availability[step].index(earliest_available)
                machine_availability[step][machine_index] = end_time

                occupancy[step].append((start_time, end_time, product))
                product_start_time = end_time

        products_in_process.append((product, product_start_time))

    return occupancy        

def occupancy_graph(initial_occupancy, optimized_occupancy):
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 7)) # Creates a figure with two different "subplots" one for start "occupancy" and one for optimized
    colors = plt.cm.rainbow(np.linspace(0, 1, len(initial_occupancy))) #here we determine a color scale for the graph, in this case rainbow
    
    def plot_occupancy(ax, occupancy, title):
        y_labels = [] #Saves "labels" for the y-axis
        y_ticks = [] #Saves positions for the y-axis
        current_y = 0 # The position of the "stack"
        
        for step_index, (step, times) in enumerate(occupancy.items()): #loops through each step and its time interval
            machine_instances = {} # saves intervals for each process/machine
            for start, end, product in times: # Loops through each time interval
                # finds the first available instance where the range fits
                instance = min((i for i in range(len(machine_instances) + 1)
                                if all(end <= s or start >= e for s, e in machine_instances.get(i, []))), default=len(machine_instances))
                machine_instances.setdefault(instance, []).append((start, end)) #set range to found instance

            for instance, instance_times in machine_instances.items(): # "plots" each interval
                for start, end in instance_times:
                    ax.barh(current_y, end - start, left=start, height=0.8,
                            align='center', color=colors[step_index], alpha=0.8)

                y_labels.append(f"{step} ({instance + 1})") #adds "labels" to the y-axis
                y_ticks.append(current_y)
                current_y += 1
            
            current_y += 0.5 #adds some space between steps
        #sets the x-axis "labels" and positions
        ax.set_yticks(y_ticks)
        ax.set_yticklabels(y_labels)
        ax.set_xlabel('Time')
        ax.set_title(title)
        # calculates total time for given sequence
        total_time = max(max(end for start, end, product in times) for times in occupancy.values())
        max_time = max(end for times in initial_occupancy.values() for _, end, _ in times) #sets the x-axis max limit
        ax.set_xlim(0, max_time)
        ax.grid(axis='x', linestyle='--', alpha=0.7)

        # adds a "legend" where we show total time
        legend_elements = [plt.Rectangle((0,0),1,1, color=colors[i]) for i in range(len(occupancy))]
        legend_labels = list(occupancy.keys())
        legend_elements.append(plt.Rectangle((0,0),1,1, fill=False, edgecolor='none'))
        legend_labels.append(f"Total Time: {total_time:.2f} min")
        # adds "legend" to "plot"
        ax.legend(legend_elements, legend_labels, loc='center left', bbox_to_anchor=(1, 0.5))

    # Gets start "occupancy" and optimized for the respective subplot
    plot_occupancy(ax1, initial_occupancy, 'Initial Sequence Occupancy')
    plot_occupancy(ax2, optimized_occupancy, 'Optimized Sequence Occupancy')
    
    plt.tight_layout()

    return fig

def export_occupancy_data(occupancy, filename):
    raw_data = [] #"raw" input data
    for step, times in occupancy.items(): #loops through and checks steps and time in "occupancy"
        for start, end, product in times:
            raw_data.append({'Step': step, 'Start Time': start, 'End Time': end, 'Product': product}) # Here we save the start and end time as well as which product was in a given machine/process at one time
    
    df = pd.DataFrame(raw_data) #saves it as pandas dataframe (hint, use data wrangler)
    df.to_excel(filename, index=False) #saves as excel from dataframe object
    
    return raw_data

def export_pallet_data(output_pallets):
    rows = []
    for entry in output_pallets:
        row_dict = entry[0]  
        row_dict['value'] = entry[1] 
        rows.append(row_dict)
    
    df = pd.DataFrame(rows)
    df.to_excel("pallet_data.xlsx", index=False)

def merge_intervals(times): # puts start and end times together so it can be used in the "machine utilization" graph
    sorted_times = sorted(times)  #sorts all start times
    merged = []
    for start, end in sorted_times: # checks each interval
        if not merged or start > merged[-1][1]: #checks if it's empty or if the ranges overlap
            merged.append([start, end]) # add current range to "merged"
        else:
            merged[-1][1] = max(merged[-1][1], end) #if there is overlap, add both ranges together
    return merged

def calculate_utilization(occupancy): # Calculates usage percentage for each machine
    total_time = max(max(end for start, end, _ in times) for times in occupancy.values()) # calculates total time by start and stop time
    utilization = {} # We save usage in this
    for step, times in occupancy.items(): # loops through each step and its interval
        merged_times = merge_intervals([(start, end) for start, end, _ in times])  # assembles overlapping ranges (does not use third value in occupancy)
        total_used_time = sum(end - start for start, end in merged_times) #calculates time for the current step
        utilization[step] = (total_used_time / total_time) * 100 # calculates usage percentage
    return utilization, total_time

def machine_utilization(initial_occupancy, optimized_occupancy):
    initial_utilization, initial_total_time = calculate_utilization(initial_occupancy) #brings out the initial machine name application
    optimized_utilization, optimized_total_time = calculate_utilization(optimized_occupancy) # brings out optimized usage
    
    steps = list(initial_utilization.keys()) # saves all machines in a list
    x = np.arange(len(steps))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(12, 7))
    
    initial_bars = ax.bar(x - width/2, initial_utilization.values(), width, label=f'Initial (Total Time: {initial_total_time:.2f})')
    optimized_bars = ax.bar(x + width/2, optimized_utilization.values(), width, label=f'Optimized (Total Time: {optimized_total_time:.2f})')
    
    ax.set_ylabel('Utilization (%)')
    ax.set_title('Machine Utilization Comparison')
    ax.set_xticks(x)
    ax.set_xticklabels(steps, rotation=45, ha='right')
    ax.legend()
    
    ax.set_ylim(0, 100)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: f"{x:.1f}%"))
    
    def add_value_labels(bars): #puts the percentage above the bars
        for bar in bars: #loops through all bars
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2, height,
                    f'{height:.1f}%',
                    ha='center', va='bottom', fontsize=8) #adds the percentage
    
    add_value_labels(initial_bars) #adds percent to stack
    add_value_labels(optimized_bars) #adds percent to stack
    
    plt.tight_layout()

    # Creates a (usable) output
    utilization_data = OrderedDict()
    for step in steps:
        utilization_data[step] = {
            'initial_utilization': round(initial_utilization[step], 1),
            'optimized_utilization': round(optimized_utilization[step], 1)
        }

    utilization_data['total_time'] = {
        'initial': round(initial_total_time, 2),
        'optimized': round(optimized_total_time, 2)
    }

    return fig, utilization_data

def product_flow(sequence, product_paths, processing_times):  # "plots" all steps for all products so it is easy to see the total time for the products
    unique_products = sorted(set(sequence)) #brings out the various products
    unique_products.reverse() # takes them backwards (it will be correct then) so it starts at the first product
    
    all_steps = sorted(set(step for product in unique_products for step in product_paths[product] if isinstance(step, str) and 'buffer' not in step.lower())) # fetches all steps that are not buffers (do this for all)
    fig, ax = plt.subplots(figsize=(12, 7)) #sets size of graph
    colors = plt.cm.rainbow(np.linspace(0, 1, len(all_steps))) # sets color scale
    step_color = {step: color for step, color in zip(all_steps, colors)}
    
    for i, product in enumerate(unique_products): #sets the time for all steps for the product
        start_time = 0
        for step in product_paths[product]:
            if isinstance(step, str) and 'buffer' not in step.lower():
                duration = processing_times[step].get(product, 0) #gets process time for current product in current step
                if duration > 0: # "plot" a bar for process time in current step
                    ax.barh(i, duration, left=start_time, height=0.5, 
                            color=step_color[step], alpha=0.8) # barh= horizontal bar
                    if duration > 1: # adds a label to the stack, only if it is significant enough, so that the texts do not overlap
                        ax.text(start_time + duration/2, i, step, 
                                ha='center', va='center', rotation=0, 
                                fontsize=8, color='black')
                    start_time += duration #updates start time for next step
                    
    ax.set_yticks(range(len(unique_products)))
    ax.set_yticklabels(unique_products)
    ax.set_xlabel('Processing Time')
    ax.set_title('Product flow through production steps and total time')

    # creates a "legend" that maps color to product
    handles = [plt.Rectangle((0,0),1,1, color=color) for color in step_color.values()]
    ax.legend(handles, step_color.keys(), title="Production Steps", 
              loc='center left', bbox_to_anchor=(1, 0.5))
    
    plt.tight_layout()
    
    return fig

def pallet_graph(best_pallet_config, val_list):
    iterations = range(1, len(val_list) + 1)

    fig, ax = plt.subplots(figsize=(12, 7))
    plt.bar(iterations, val_list, color='skyblue', edgecolor='navy')
    plt.title('Fitness optimization progress and pallet configuration')
    plt.xlabel('Iteration')
    plt.ylabel('Total time')
    plt.grid(axis='y', linestyle='--', alpha=0.7)

    # Here we mark the best fitness value
    best_fitness = min(val_list)
    best_iteration = val_list.index(best_fitness) + 1
    plt.bar(best_iteration, best_fitness, color='navy', edgecolor='navy')

    # We create a string with the best pallet configuration
    pallet_config_str = ', '.join([f"{k}: {v}" for k, v in best_pallet_config.items()])

    # Here we add text for the best configuration
    plt.text(best_iteration, best_fitness, f'Fitness: {best_fitness:.2f}\n{pallet_config_str}', 
            ha='center', va='bottom', fontweight='bold', bbox=dict(facecolor='white', alpha=0.5))

    plt.tight_layout()

    return fig 

#Here we create the function that keeps track of which graph should be displayed in the new window that opens when you click on the "Next" and "Previous" buttons in the new window that opens when you click on "Machine Utilization Graph"
def show_graph(window, fig_list, index):
    #Here we make sure that we clear everything in the box so that nothing will "overlap"
    for widget in window.winfo_children():
        widget.destroy()
    
    fig = fig_list[index] #Here we select which figure should be displayed
    canvas = FigureCanvasTkAgg(fig, master=window) #Here we embed the matplotlib graph in a tkinter window
    canvas.draw()
    canvas.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    #This function allows us to save our plot when we have right-clicked and pressed "save"
    def save_plot():
        file_path = f"graph_{index + 1}.png"
        fig.savefig(file_path)

    #This function causes the popup box to appear when we right click on the graph
    def popup(event):
        menu = Menu(
            window,
            tearoff=0
        )

        menu.add_command(
            label="Save graph as PNG",
            command=save_plot
        )

        menu.post(event.x_root, event.y_root)

    canvas.get_tk_widget().bind("<Button-3>", popup) # Here we set right-click to run the popup function (the button can be changed to anything if you don't think right-click is appropriate)

#Here we create the function that opens the new window when clicking on "Machine Utilization Graph" in the main window
def machine_util(window, output_screen, pallet_var):
    try: 
        now = datetime.now() # Here we retrieve the date and time jsut now
        title = now.strftime("%m/%d/%Y %H:%M") # Here we reformat the date

        new_window = Toplevel(window) # Here we create a new window that will be above the main window
        new_window.title("Optimization Completed at " + title) #The name of the window that opens
        # Here we calculate values ​​for the machine occupancy graph (original use and after optimization)
        if selected_setup_time is not None:
            if pallet_var.get() == 1:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallets, setup_times_dict)
            else:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)

        else:
            if pallet_var.get() == 1:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallets)
            else:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount)
        
        # Here we save all the figures so that we can then jump between them.
        fig1 = occupancy_graph(initial_occupancy, optimized_occupancy)
        fig2, utilization_results = machine_utilization(initial_occupancy, optimized_occupancy)
        fig3 = product_flow(best_solution_copy, product_paths, processing_times)

        # We then create a list of all figures and set current_index to 0 (ie we start showing the first graph)
        fig_list = [fig1, fig2, fig3]
        current_index = [0]

        if pallet_var.get() == 1:
            fig4 = pallet_graph(best_pallet_config, val_list)
            fig_list.append(fig4)
    except Exception as E:
        output_screen.insert('end', f"\nCan't show graph because no optimization was done. {E}")
        output_screen.see(tk.END)

    # Here we create a function that will jump forward one step and display the next graph in the list
    def show_next():
        current_index[0] = (current_index[0] + 1) % len(fig_list) #We go one step to the right (you can imagine that this list goes around in a circle, i.e. if we get to the last index in the list, the next step will be the first index)
        show_graph(new_window, fig_list, current_index[0]) # Here we choose which graph to display
        buttons(current_index[0]) # This function call ensures that our "Next" and "Previous" buttons don't disappear when we go to the next graph
    
    # Exactly the same function as above, the only difference is that we go to the left instead
    def show_previous():
        current_index[0] = (current_index[0] - 1) % len(fig_list)
        show_graph(new_window, fig_list, current_index[0])
        buttons(current_index[0])

    show_graph(new_window, fig_list, current_index[0]) # We start by displaying the first graph in the list
    
    # Function to export the utilization data to excel sheets
    def export_data(utilization_results):
        df = pd.DataFrame.from_dict(utilization_results, orient='index')
        df.to_excel('utilization_data.xlsx')

    #This function creates all our buttons in the new window
    def buttons(current_index):
        nav_frame = tk.Frame(new_window) #Here we create a frame for where the buttons will be located (bottom)
        nav_frame.pack(
            side=tk.BOTTOM,
            fill=tk.X
        )
        
        #Here we place the "previous" button in the frame we created above and set it to the left of the frame
        prev_button = tk.Button(
            nav_frame,
            text="Previous",
            command=show_previous
        )

        prev_button.pack(
            side=tk.LEFT,
            padx=5,
            pady=5
        )

        #Here we place the "next" button in the frame we created above and set it to the right of the frame
        next_button = tk.Button(
            nav_frame,
            text="Next",
            command=show_next
        )
        next_button.pack(
            side=tk.RIGHT,
            padx=5,
            pady=5
        )

        if current_index == 1:
            #Here we place the "export" button in the frame we created above and set it in the middle of the frame (we set tk.LEFT as it is to the left of the "next" button, which makes it end up in the middle)
            export_button = tk.Button(
                nav_frame,
                text='Export',
                command=lambda: export_data(utilization_results)
            )
            export_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )
        elif current_index == 0:

            export_util_button = tk.Button(
                nav_frame,
                text='Export',
                command=lambda: (export_occupancy_data(initial_occupancy, 'initial_occupancy.xlsx'), export_occupancy_data(optimized_occupancy, 'optimized_occupancy.xlsx'))
            )
            export_util_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )
        elif current_index == 3:
            export_util_button = tk.Button(
                nav_frame,
                text='Export',
                command=lambda: export_pallet_data(output_pallets)
            )
            export_util_button.pack(
                side=tk.LEFT,
                padx=5,
                pady=5
            )
    buttons(current_index[0]) # We call this function here so we have buttons to start with in the new window

# This function checks all boxes so that if a box is empty, i.e. you have not clicked on "Part" but have manually removed what was filled in, this function will set the value to None.
def check_screen(screen, chosen_file):
    content = screen.get("1.0", tk.END).strip()

    if not content:
        chosen_file = None
    return chosen_file
